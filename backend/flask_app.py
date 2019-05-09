#!/usr/bin/env python2

import os
import subprocess
import boto3
import shutil
import time
import json
import git
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

aws_access = str(os.getenv("ACCESS_ID"))
aws_secret = str(os.getenv("ACCESS_KEY"))

@app.route('/', methods=['GET'])
@app.route('/health_check', methods=['GET'])
def health_check():
    return jsonify(success=True)

@app.route('/last_commits', methods=['GET'])
def last_commits():
    #parses in relevant info from request args
    repo_link = request.args.get('git_address', None)
    num_commits = int(request.args.get('num_commits', None))
    bucket_name = request.args.get('bucket_name', None)

    path = os.getcwd()
    repo_name = repo_link.split("/")[-1].split('.')[:-1][0] #this is convoluted
    path_to_repo = path + "/" + repo_name

    '''
    Uploads given files to given bucket. The version number is for naming
    the destination file.
    '''
    def upload(files, bucket_name, version):
        s3 = boto3.resource('s3', aws_access_key_id=aws_access, aws_secret_access_key=aws_secret)
        files = " ".join(files)

        #zips relevant files
        zip_proc = subprocess.Popen(("zip " + str(version) + ".zip " + files).split())
        zip_proc.wait()

        #upload zip to bucket
        filename = str(version) + ".zip"
        s3.meta.client.upload_file(filename, bucket_name, filename)

    '''
    Clone repository (link taken as command line arg)
    '''
    git.Repo.clone_from(repo_link, path_to_repo)


    '''
    Each iteration goes back one commit, collects relevant files, and calls
    upload function.
    '''
    for i in range(num_commits):
        #checks out commits, but ignores first time around (to get current commit)
        if i > 0:
            proc = subprocess.Popen(['git','-C', repo_name,'checkout','HEAD~1'])
            proc.wait()

        #collects all files not in a .git directory
        to_upload = []
        for root, dirs, files in os.walk(repo_name):
            if '.git' in root.split("/"):
                continue
            for f in files:
                to_upload.append(os.path.join(root, f))

        '''
        We can ignore upload failure here since it will trigger an error elsewhere.
        This way the locally cloned repo is deleted regardless of upload success.
        '''
        try:
            upload(to_upload, bucket_name, i)
        except:
            break #don't continue if even one upload fails

    '''
    Cleans up by deleting cloned repository and zipped commits.
    '''
    shutil.rmtree(path_to_repo)

    for i in range(num_commits):
        os.remove(path + "/" + str(i) + ".zip")

    return jsonify(success=True)

'''
This endpoint clones the repository and gets the past n hashes fo n commits.
'''
@app.route('/get_past_hashes', methods=['GET'])
def get_past_hashes():
    num_commits = int(request.args.get('num_commits', None))
    repo_link = request.args.get('git_address', None)
    repo_name = repo_link.split("/")[-1].split('.')[:-1][0] #this is convoluted

    path = os.getcwd() + "/" + repo_name
    git.Repo.clone_from(repo_link, path)

    g = git.Git(path)
    loginfo = g.log('--pretty=tformat:"%h"','-' + str(num_commits)).replace('"','').split()

    shutil.rmtree(path)
    return jsonify(loginfo)


@app.route('/delete_source', methods=['GET'])
def delete_source():
    bucket_name = request.args.get('bucket_name', None)
    suffix = request.args.get('suffix', None)

    s3 = boto3.resource('s3', aws_access_key_id=aws_access, aws_secret_access_key= aws_secret)
    bucket = s3.Bucket(bucket_name)
    objects_to_delete = []
    for obj in bucket.objects.all():
        if obj.key.endswith(suffix):
            objects_to_delete.append({'Key': obj.key})

    if objects_to_delete != []:
        bucket.delete_objects(
            Delete={
                'Objects': objects_to_delete
            }
        )

    return jsonify(success=True)

@app.route('/get_results', methods=['GET'])
def get_results():
    timeout = 10 #in seconds
    bucket_name = request.args.get('bucket_name', None)
    num_commits = int(request.args.get('num_commits', None))

    s3 = boto3.resource('s3', aws_access_key_id=aws_access, aws_secret_access_key=aws_secret)
    bucket = s3.Bucket(bucket_name)
    all_buckets = bucket.objects.all()
    length = sum(1 for _ in all_buckets)
    while length != num_commits and timeout > 0:
        print(length, num_commits)
        time.sleep(0.2) #sleep 200 ms
        timeout -= 0.2
        all_buckets = bucket.objects.all()
        length = sum(1 for _ in all_buckets)

    if timeout < 0 and length != num_commits:
        abort(504)

    results = getJson(bucket_name, num_commits, s3)
    return jsonify(results)

def getJson(bucket_name, num_commits, s3):
    result = {}
    for i in range(0, num_commits):
        content_object = s3.Object(bucket_name, str(i) + '.json')
        file_content = content_object.get()['Body'].read().decode('utf-8')
        json_content = json.loads(file_content)
        json_content['TIMESTAMP'] = content_object.last_modified
        result[i] = json_content

    return result

if __name__ == '__main__':
    app.debug = True
    port = int(os.environ.get("PORT", 5002))
    app.run(host='0.0.0.0', port=port)
