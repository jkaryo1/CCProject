import subprocess
import sys

'''
    This file is a local version of what our lambda functions should be running.
    Instead of FILEPATH and TESTPATH, we would have the address of the AWS S3
    bucket we created and would cherry pick a specific commit to test on.
'''
length = sys.argv[1]

# Results seem to begin significance when input size is ~10,000
FILEPATH = "../CloudComp-Testing/main_file.py"
TESTPATH = "../CCProject/input_" + length

try:
    with open(TESTPATH) as f:
      arraySorted = f.readlines()
    arraySorted = [int(i.strip()) for i in arraySorted]
    arraySorted.sort()
except EnvironmentError:
    print("error")

try:
    sorting_func = "bubble"
    result = subprocess.run(['python3.7', FILEPATH, sorting_func, TESTPATH], stdout=subprocess.PIPE)
    array = list(map(int, result.stdout.decode('utf-8').splitlines()))
    if array != arraySorted:
        exit(1)
    sorting_func = "selection"
    result = subprocess.run(['python3.7', FILEPATH, sorting_func, TESTPATH], stdout=subprocess.PIPE)
    array = list(map(int, result.stdout.decode('utf-8').splitlines()))
    if array != arraySorted:
        exit(1)
    sorting_func = "insertion"
    result = subprocess.run(['python3.7', FILEPATH, sorting_func, TESTPATH], stdout=subprocess.PIPE)
    array = list(map(int, result.stdout.decode('utf-8').splitlines()))
    if array != arraySorted:
        exit(1)
except:
    exit(1)
exit(0)
