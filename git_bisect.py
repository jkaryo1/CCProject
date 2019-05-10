import subprocess
import time
import sys

length = sys.argv[1]

# Times git bisect run of testing suite
# MUST BE CALLED FROM INSIDE TESTING REPO
start = time.time()
proc = subprocess.Popen(("git bisect start 658e93d 9ef8eb6").split())
proc.wait()
proc = subprocess.Popen(("git bisect run python ../CCProject/test_sorting.py " + length).split())
proc.wait()

end = time.time()
print(end - start)
