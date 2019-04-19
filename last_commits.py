import os
import sys
import subprocess

path = os.path.dirname(os.path.realpath(__file__))

repo_link = sys.argv[1]
num_commits = int(sys.argv[2])
repo_name = repo_link.split("/")[-1].split('.')[:-1][0] #this is convoluted

proc = subprocess.Popen(("git clone " + repo_link).split())
proc.wait()

proc = subprocess.Popen(("mkdir versions").split())
proc.wait()

for i in range(num_commits):
    if i > 0:
        proc = subprocess.Popen(("git -C " + repo_name + " checkout HEAD~1").split())
        proc.wait()

    copy_proc = subprocess.Popen(("rsync -av " + repo_name + " versions/ --exclude " + repo_name + "/.git").split())
    copy_proc.wait()

    rename_proc = subprocess.Popen(("mv versions/" + repo_name + " versions/" + str(i)).split())
    rename_proc.wait()


#THIS BUCKET NAME NEEDS TO NOT BE HARDCODED
bucket_name = sys.argv[3] #"jhu-cloud-computing-lubowsky-test"
aws_command = 'aws s3 cp versions/ s3://' + bucket_name + ' --recursive --exclude "*" --include "*"'

aws_proc = subprocess.Popen((aws_command).split())
aws_proc.wait()

proc = subprocess.Popen(("rm -rf versions " + repo_name).split())
proc.wait()
