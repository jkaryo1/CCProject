import matplotlib.pyplot as plt
import os
import numpy as np
import json

commits = [5, 10, 15, 20]
input_size = [1000, 5000, 10000]

files = [i for i in os.listdir('.') if 'csv' in i]

data = {str(i):{str(j):{'avg': 0, 'std': 0, 'max': 0, 'max_std': 0} for j in commits} for i in input_size}
for i in files:
    name = i.split(".")[0]
    input = name.split('-')[1]
    commit = name.split('-')[0]

    with open(i, "r") as f:
        line = f.read().split(",")

        data[input][commit]['avg'] = line[0]
        data[input][commit]['std'] = line[2]
        data[input][commit]['max'] = line[1]
        data[input][commit]['max_std'] = line[3]

files = [i for i in os.listdir('.') if '.out' in i]
for i in files:
    name = i.split(".")[0]
    input = name.split('output')[1]
    commit = name.split('output')[0]

    with open(i, "r") as f:
        line = f.read().split("\n")[-3:-1]
        mean = float(line[0].split(":")[1])
        std = float(line[1].split(":")[1])

        data[input][commit]['bisect'] = mean
        data[input][commit]['bisect_std'] = std

fig, (one_k) = plt.subplots(nrows=1, sharex=True)

lambda_data = [float(v['20']['avg']) for k,v in data.items()]
lambda_error = [float(v['20']['std']) for k,v in data.items()]
one_k.errorbar(input_size, lambda_data, yerr=lambda_error, fmt='-o')

lambda_data = [float(v['20']['max']) for k,v in data.items()]
one_k.errorbar(input_size, lambda_data, fmt='-o')

lambda_data = [float(v['20']['bisect']) for k,v in data.items()]
lambda_error = [float(v['20']['bisect_std']) for k,v in data.items()]
one_k.errorbar(input_size, lambda_data, yerr=lambda_error, fmt='-o')

one_k.set_title('Amount of Commits 20')


plt.legend(["Our Tool's Average", "Our Tool's Max", "Git Bisect Average"])

plt.xlabel('Size of Input File')
plt.ylabel('Duration of Test')
plt.show()
