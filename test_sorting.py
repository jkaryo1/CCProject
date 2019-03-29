import subprocess

'''
    This file is a local version of what our lambda functions should be running.
    Instead of FILEPATH and TESTPATH, we would have the address of the AWS S3
    bucket we created and would cherry pick a specific commit to test on.
'''

FILEPATH = "../CloudComp-Testing/main_file.py"
TESTPATH = "../CCProject/input_10"

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
print(array == arraySorted)
