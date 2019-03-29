# Welcome to the Homepage for our Cloud Computing Project

As most software engineers know, as codebases develop, new bugs are constantly being introduced and are often hard to detect and fix. We would like to propose a git based application that - from a specific repository - pulls multiple past code commits, and runs a series of tests on each build in order to determine which commit in the commit history is responsible for a specific bug. These tests would be deployed on separate AWS Lambda instances to allow this testing to occur in parallel, saving engineers valuable time.

This repository will be holding all the deploying and testing code:
  - *create_random.py*: Python script to create a specified array length of random intergers and writing the array and sorted array to files.
  - *name_of_git_clone_script*:

We will be using the following [repository](https://github.com/LionelEisenberg/CloudComp-Testing/) for to hold the code that we will be using our application on. For more specifics please see the README for that repository, but to summarize we have a rather basic python script that sorts an array of intergers and prints 

## Instructions:

## Checkpoint 1:

**Plan**

To accomplish our goal, we have developed a general plan of attack that we hope to follow.

1.  *Create a codebase/repository and a testing suite to test its functionality* - In order to evaluate the effectiveness of AWS Lambda in detecting code changes, we need to actually develop a code base and a testing suite.  The code that we wish to test should not be overly complex, but the overall time to complete should not be too short since we need to collect performance data.  We also need to introduce many commits in the repository so that we can look at past history.

2.  *git-bisect* - After we have a codebase and testing suite, we need to learn how to use git-bisect (manual and automated).  From here, we can quanitatively see how long it takes to find a code breaking bug in the repository.

3.  *Pull previous commits from Github repository* - We need to be able to grab previous commits from a repository and save the files from those commits in an efficient manner in order to utilize AWS Lambda.

4.  *Upload previous commits to AWS S3 bucket* - We need to be able to upload the files from the previous commits to an AWS S3 bucket.  After a file is uploaded, a Lambda function will be triggered.  Amazon has well documeneted examples explaining how to properly trigger Lambdas using their S3 service.

5.  *Create Lambda functions* - We need to create Lambda functions that will run with the previous commit code and a testing file.  We plan to trigger the Lambda by uploading the commit code to an S3 bucket.  The Lambda will execute the test suite and report back TRUE or FALSE indicating whether the test cases passed or failed.

6.  *Compare computation time between AWS Lambda and git-bisect* - This will ultamitely allow us to determine which method of testing is superior.

7.  *Edit paramaters/Optimize code* - After we initially compare git-bisect to AWS Lambda, we can begin to edit the codebase to cover a wider array of scenarios.  We can create more complex functions and see how performances varies.  We can also begin to optimize our code and see if there are other ways to go about this problem.  For example, as a team we were debating whether the Lambdas themselves should pull from the git repository instead of the local machine doing so.  

8. *Stretch Goals*:
  a. Creating a frontend/UI
  b. Optimizing the amount of tests each lambda function is running
  c. Make more modularizable
  d. Shorting lambdas if previous commits have already been found to cause isse

**Current Status:**

**Who Has Done What:**

  0. *General*
  
      All group members contributed to brainstorming the best and most efficient way to put our project proposal into action. From researching the different cloud providers and comparing their pros and cons, to figuring out the best flow for our application.

  1. *Sanat Deshpande*
  
      I dedicated some time to familiarzing myself with how aws worked, and how to interact with s3 bucket storage using the aws CLI. This  was since our plan is to use s3 buckets as the source of files for our lambda instances. Second, I experimented with the best way to clone any given repository and obtain the last n commits from that repo. I wrote a bash script to do so, but it was rather difficult to do everything we needed in bash, so I elected to write a python script to do the same thing. This presented its own challenges in terms of managing the subprocesses to clone and checkout various commits.
      
  2. *Lionel Eisenberg*
  
      I started this project by familiarizing myself with AWS Serverless functions and understanding how they work in the AWS system, how to trigger them with AWS API managment and how they differ from conventional backend servers. 
      I also created testing repository that we will be running our program on, creating the python script that sorts an array using three different algorithms. I also wrote the code to generate input files for our tests, this file should create a random specified length array and print it out to a file.
      Finally I examined the best ways to trigger the lambda test functions when we push our files to the s3 bucket we will be testing on.
      
  3. *Jon Karyo*
  
      I started out by going through the tutorial to create a GCP homepage. However, after it was live for 2 days, I had already burned through $6 in credits. So we decided to simply use GitHub pages for our project's homepage. I helped James troubleshoot permission issues for the S3 bucket, and we figured out how to give users from other accounts bucket permissions. I also collaborated with Sanat to coordinate the logistics of the git cloning of the previous n commits. Sanat and I are looking into the feasibility of cloning git repos directly inside of an AWS Lambda instance, although our initial research seems to indicate that we may be sticking with the bucket approach.
  
  4. *James Lubowsky*
  
      I have been focusing the majority of my attention on AWS.  As mentioned above, we plan on uploading previous git commits to an S3 bucket that our Amazon Lambdas can access.  For this checkpoint, I learned and created an S3 bucket that we will probably use for the remainder of our project.  The name of the bucket is *jhu-cloud-computing-lubowsky-test*.  The bucket is public and allows anyone to read from it, but our group has credentials to write to the bucket.
      
      I also created a bash script that uploads several txt files at once to the bucket and then deletes all files in the bucket.  I wanted to just experiment with these functionalities, and successfully learned how to do so since they are important for what we will be accomplishing.
