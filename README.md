# Welcome to the Homepage for our Cloud Computing Project

As most software engineers know, as codebases develop, new bugs are constantly being introduced and are often hard to detect and fix. We would like to propose a git based application that - from a specific repository - pulls multiple past code commits, and runs a series of tests on each build in order to determine which commit in the commit history is responsible for a specific bug. These tests would be deployed on separate AWS Lambda instances to allow this testing to occur in parallel, saving engineers valuable time.

This repository will be holding all the deploying and testing code:
  - *create_random.py*: Python script to create a specified array length of random intergers and writing the array and sorted array to files. To run: `python create_random.py <length_of_random_array>`
  - *last_commits.py*: Python script that clones the specified repository and makes copies of each of the past n commits (including the current one) in separate folders. These versions are all uploaded to an aws bucket for testing. To run: `python last_commits.py <link_to_repository> <number_of_commits>`
  - *add_remove_bucket*: Bash script that adds all files in a directory to an S3 bucket and then removes everything in the bucket.  To run:  `./add_remove_bucket`, however, since our bucket is private, other users should get an Access Denied error.
  - *test_sorting.py*: Python script that currently has hard coded values to test the Main Sorting Function repository we want to test. This file is a dummy "proof of concept" that should vary when converted to lambda functions. To run: `python test_sorting.py`.

We will be using the following [repository](https://github.com/LionelEisenberg/CloudComp-Testing/) for to hold the code that we will be using our application on. For more specifics please see the README for that repository, but to summarize we have a rather basic python script that sorts an array of intergers and prints 

## Checkpoint 1:

**Plan**

To accomplish our goal, we have developed a general plan of attack that we hope to follow.

1.  *Create a codebase/repository and a testing script to test its functionality* - In order to evaluate the effectiveness of AWS Lambda in detecting code changes, we need to actually develop a code base and a testing script.  The code that we wish to test should not be overly complex, but the overall time to complete should not be too short since we need to collect performance data.  We also need to introduce many commits in the repository so that we can look at past history.
  
    We will operate at a level of abstraction that allows our tool to generalize to any programming language and any testing script. As our lambda function has neither any knowledge of the program running nor any criteria by which to judge a "good" or "bad" commit, the user must provide a script that interprets the results of their testing script as a simple good/bad categorization. This allows us to achieve maximal generalizability and to focus on the task of automatically fetching, deploying, and testing all of the specified commits in parallel.

2.  *git-bisect* - After we have a codebase and testing script, we need to learn how to use git-bisect (manual and automated).  From here, we can quanitatively see how long it takes to find a code breaking bug in the repository.

3.  *Pull previous commits from Github repository* - We need to be able to grab previous commits from a repository and save the files from those commits in an efficient manner in order to utilize AWS Lambda.

4.  *Upload previous commits to AWS S3 bucket* - We need to be able to upload the files from the previous commits to an AWS S3 bucket.  After a file is uploaded, a Lambda function will be triggered.  Amazon has well documeneted examples explaining how to properly trigger Lambdas using their S3 service.

5.  *Create Lambda functions* - We need to create Lambda functions that will run with the previous commit code and a testing file.  We plan to trigger the Lambda by uploading the commit code to an S3 bucket.  The Lambda will execute the test script and report back TRUE or FALSE indicating whether the test cases passed or failed.

6.  *Compare computation time between AWS Lambda and git-bisect* - This will ultamitely allow us to determine which method of testing is superior.

7.  *Edit paramaters/Optimize code* - After we initially compare git-bisect to AWS Lambda, we can begin to edit the codebase to cover a wider array of scenarios.  We can create more complex functions and see how performances varies.  We can also begin to optimize our code and see if there are other ways to go about this problem.  For example, as a team we were debating whether the Lambdas themselves should pull from the git repository instead of the local machine doing so.  

8. *Stretch Goals*:
  * Creating a frontend/UI
  * Optimizing the amount of tests each lambda function is running
  * Make more modularizable
  * Shorting lambdas if previous commits have already been found to cause isse

**Current Status:**
* Created a codebase/repository and a testing script.
* Ran git-bisect manually on our repository and found where a bug was introduced.
* Ran automated git-bisect on our repository and found where a bug was introduced.
* Created a script to pull the past n commits from our repository.
* Successfully created an S3 bucket with appropriate credientals.
* Successfully uploaded and deleted files from the S3 bucket using AWS CLI.
* Resereached topic more in depth and developed plan and architecture of project.


**Who Has Done What:**

  0. *General*
  
      All group members contributed to brainstorming the best and most efficient way to put our project proposal into action. From researching the different cloud providers and comparing their pros and cons, to figuring out the best flow for our application. Finally we all participated in the write up of the README.

  1. *Sanat Deshpande*
  
      I dedicated some time to familiarzing myself with how aws worked, and how to interact with s3 bucket storage using the aws CLI. This  was since our plan is to use s3 buckets as the source of files for our lambda instances. Second, I experimented with the best way to clone any given repository and obtain the last n commits from that repo. I wrote a bash script to do so, but it was rather difficult to do everything we needed in bash, so I elected to write a python script to do the same thing. This presented its own challenges in terms of managing the subprocesses to clone and checkout various commits.
      
  2. *Lionel Eisenberg*
  
      I started this project by familiarizing myself with AWS Serverless functions and understanding how they work in the AWS system, how to trigger them with AWS API managment and how they differ from conventional backend servers. 
      I also created testing repository that we will be running our program on, creating the python script that sorts an array using three different algorithms. I also wrote the code to generate input files for our tests, this file should create a random specified length array and print it out to a file.
      I wrote the testing function for the bubble sort part of the repository we will be testing in this project. I then managed to get results using `git bisect run python test_sorting.py ../CloudComp-Testing/main_file.py`. This was very quick but also only tested on a couple commits, and on very small sized files.
      Finally I examined the best ways to trigger the lambda test functions when we push our files to the s3 bucket we will be testing on.
      
  3. *Jon Karyo*
  
      I started out by going through the tutorial to create a GCP homepage. However, after it was live for 2 days, I had already burned through $6 in credits. So we decided to simply use GitHub pages for our project's homepage. I helped James troubleshoot permission issues for the S3 bucket, and we figured out how to give users from other accounts bucket permissions. I also collaborated with Sanat to coordinate the logistics of the git cloning of the previous n commits. Sanat and I are looking into the feasibility of cloning git repos directly inside of an AWS Lambda instance, although our initial research seems to indicate that we may be sticking with the bucket approach.
  
  4. *James Lubowsky*
  
      I have been focusing the majority of my attention on AWS.  As mentioned above, we plan on uploading previous git commits to an S3 bucket that our AWS Lambdas can access.  For this checkpoint, I learned about and created an S3 bucket that we will use for the remainder of our project.  The name of the bucket is *jhu-cloud-computing-lubowsky-test*.  The bucket is public and allows anyone to read from it, but our group has credentials to write to the bucket.  We made the bucket public just to show the instructors what we accomplished, but when we run our Lambdas, we will make it private again.
      
      I also created a bash script that uploads all files at once to the bucket and then deletes everything in the bucket.  I wanted to just experiment with these functionalities and I successfully learned how to do so since they are important for what we will be accomplishing.  Although the script is not very long, the entire process of learning about S3 buckets was time consuming and dealing with permissions was difficult as well.  
      
**Next Steps**

1. *Configure/Write Lambda Instances* 
 
    Our current plan is to have lambda instances trigger in response to an upload to an s3 bucket. This will require us to configure an s3 bucket on-the-fly for the user and ensure that a lambda function is spun up for each of the commits that we want to test in the bucket.  We will also need to write such Lambda functions neccessary to complete our goal.
    
2. *Write Testing Function*

    We need to write the actual code that will fetch the correct version/commit of the repository from an s3 bucket, and run the user's testing scripts. A secondary challenge will be figuring out how to get the results back to the user. We could either try communicating this back by writing to the s3 bucket, or through some means that communicates with the user directly. More research into the specifics of this is required.
    
 3. *Timing/Metrics*
 
    The purpose of our project is to be able to quickly identify the failing commit in a codebase, hence our use of Lambda functions testing all commits in parallel. We will time how long it takes for us to get meaningful results from each lambda function, as well as an end-to-end time. It will be useful for us to compare ourselves to the `git bisect run` command as a benchmark, and analyze not only the time/efficiency of our tool with respect to this existing tool, but also the cost of running `git bisect` vs several parallel Lambda instances.

## Checkpoint 2:

**Plan**
To accomplish our goal, we generated a general plan of attack that we hope to follow.

1.  *Trigger Lambda on Upload to S3 Bucket* - For our project, we are uploading multiple previous commits to a single S3 source bucket (now properly named jhu-cloud-source2).  When a file gets uploaded, we want to trigger a testing lambda on the file, so it is imperative that we understand how to properly AWS Lambda with S3.

2.  *Use Lambda to upload files to an S3 bucket* - We plan on writing the sucess rate of a particular test to another bucket for simple ease of access for the user.  To accomplish this goal, we plan on using boto3 to integrate functionality.


