# Welcome to the Homepage for our Cloud Computing Project

As most software engineers know, as codebases develop, new bugs are constantly being introduced and are often hard to detect and fix. We would like to propose a git based application that - from a specific repository - pulls multiple past code commits, and runs a series of tests on each build in order to determine which commit in the commit history is responsible for a specific bug. These tests would be deployed on separate AWS Lambda instances to allow this testing to occur in parallel, saving engineers valuable time.

This repository will be holding all the deploying and testing code:
  - *create_random.py*: Python script to create a specified array length of random intergers and writing the array and sorted array to files.
  - *name_of_git_clone_script*:

We will be using the following [repository](https://github.com/LionelEisenberg/CloudComp-Testing/) for to hold the code that we will be using our application on. For more specifics please see the README for that repository, but to summarize we have a rather basic python script that sorts an array of intergers and prints 

## Instructions:

## Checkpoint 1:

- **Current Status:**

- **Who Has Done What:**
  1. *Sanat Deshpande*
  2. *Lionel Eisenberg*
  3. *Jon Karyo*
  4. *James Lubowsky*
  
      I have been focusing the majority of my attention on AWS.  As mentioned above, we plan on uploading previous git commits to an S3 bucket that our Amazon Lambdas can access.  For this checkpoint, I learned about and created an S3 bucket that we will use for the remainder of our project.  The name of the bucket is *jhu-cloud-computing-lubowsky-test*.  The bucket is public and allows anyone to read from it, but our group has credentials to write to the bucket.
      
      I also created a bash script that uploads several files at once to the bucket and then deletes the files.  I wanted to just experiment with these functionalities, and successfully learned how to do so.  We plan on using a bashscript on our local machines to execute all our tasks, so it was imperative that I determine how to do these commands from the command line using AWSCLI.  
