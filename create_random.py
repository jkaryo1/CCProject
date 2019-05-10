import os
import random
import sys

length = int(sys.argv[1])
array = []
for i in range(length):
    rand = random.randint(-999999, 999999)
    array.append(rand)

sorted_array = sorted(array)
f = open('../CCProject/input_' + str(length), 'w')
f2 = open('../CCProject/sorted_' + str(length), 'w')
for i in range(len(array)):
    f.write(str(array[i]) + "\n")
    f2.write(str(sorted_array[i]) + "\n")
