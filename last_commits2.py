import os
import sys
import subprocess
import boto3

path = os.path.dirname(os.path.realpath(__file__))

#parses in relevant info from command line args
repo_link = sys.argv[1]
num_commits = int(sys.argv[2])
bucket_name = sys.argv[3]
repo_name = repo_link.split("/")[-1].split('.')[:-1][0] #this is convoluted


'''
Uploads given files to given bucket. The version number is for naming
the destination file.
'''
def upload(files, bucket_name, version):
    s3 = boto3.resource('s3')
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
proc = subprocess.Popen(("git clone " + repo_link).split())
proc.wait()


'''
Each iteration goes back one commit, collects relevant files, and calls
upload function.
'''
for i in range(num_commits):
    #checks out commits, but ignores first time around (to get current commit)
    if i > 0:
        proc = subprocess.Popen(("git -C " + repo_name + " checkout HEAD~1").split())
        proc.wait()

    #collects all files not in a .git directory
    to_upload = []
    for root, dirs, files in os.walk(repo_name):
        if '.git' in root.split("/"):
            continue
        for f in files:
            to_upload.append(os.path.join(root, f))

    upload(to_upload, bucket_name, i)

'''
Cleans up by deleting cloned repository and zipped commits.
'''
proc = subprocess.Popen(("rm -rf " + repo_name).split())
proc.wait()

for i in range(num_commits):
    delete_proc = subprocess.Popen(("rm " + str(i) + ".zip").split())
    delete_proc.wait()
