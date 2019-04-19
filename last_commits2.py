import os
import sys
import subprocess
import boto3

path = os.path.dirname(os.path.realpath(__file__))

repo_link = sys.argv[1]
num_commits = int(sys.argv[2])
bucket_name = sys.argv[3]
repo_name = repo_link.split("/")[-1].split('.')[:-1][0] #this is convoluted



def upload(files, bucket_name, version):
    s3 = boto3.resource('s3')
    for f in files:
        dest = os.path.join(str(version),"/".join(f.split("/")[1:]))
        s3.meta.client.upload_file(f, bucket_name, dest)

proc = subprocess.Popen(("git clone " + repo_link).split())
proc.wait()


for i in range(num_commits):
    if i > 0:
        proc = subprocess.Popen(("git -C " + repo_name + " checkout HEAD~1").split())
        proc.wait()

    to_upload = []
    for root, dirs, files in os.walk(repo_name):
        if '.git' in root.split("/"):
            continue
        for f in files:
            to_upload.append(os.path.join(root, f))
    
    for up in to_upload:
        upload(to_upload, bucket_name, i)

proc = subprocess.Popen(("rm -rf " + repo_name).split())
proc.wait()
