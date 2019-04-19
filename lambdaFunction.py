import boto3
import os
import sys
import uuid
import json
import subprocess
from zipfile import ZipFile

s3_client = boto3.client('s3')

def test_file(download_path, testing_path):
    FILEPATH = download_path
    TESTPATH = testing_path

    try:
        with open(TESTPATH) as f:
          arraySorted = f.readlines()
        arraySorted = [int(i.strip()) for i in arraySorted]
        arraySorted.sort()
    except EnvironmentError:
        print("error")

    sorting_func = "bubble"
    result = subprocess.run(['python3.7', FILEPATH, sorting_func, TESTPATH], stdout=subprocess.PIPE)
    array = list(map(int, result.stdout.decode('utf-8').splitlines()))
    return array == arraySorted

def handler(event, context):
    for record in event['Records']:
        # This gets the name of the file that was uploaded
        key = record['s3']['object']['key']
        # This line gets the bucket name from the event that triggered it.
        source_bucket = record['s3']['bucket']['name']
        target_bucket = 'jhu-cloud-target2'
        # Creates a local temp path for the file we download.
        zip_path = '/tmp/{}'.format(key)
        zip_dir = '/tmp/'
        main_path = '/tmp/main_file.py'
        # crerate path the input for the test will be on
        testing_path = '/tmp/test-file'
        testing_key = 'input_10000'
        # Creates a local temp path for the results.
        upload_path = '/tmp/result-{}'.format(key)

        # get files from bucket
        s3_client.download_file(source_bucket, key, zip_path)
        s3_client.download_file(source_bucket, testing_key, testing_path)

        # From zip get main_file
        with ZipFile("file.zip","r") as zip_ref:
            zip_ref.extractall(main_target_dir)
            print('works')

        success = test_file(main_path, testing_path)
        print(success)
        file = open(upload_path, 'w')
        file.write(str(success) + "\n")
        file.close()

        # upload file to target bucket.
        s3_client.upload_file(upload_path, target_bucket, key)
        return
