import subprocess
import time

# Times git bisect run of testing suite
# MUST BE CALLED FROM INSIDE TESTING REPO
start = time.time()
proc = subprocess.Popen(("git bisect start 26bbde2 f3f93fc").split())
proc.wait()
proc = subprocess.Popen(("git bisect run python ../CCProject/test_sorting.py").split())
proc.wait()

end = time.time()
print(end - start)
