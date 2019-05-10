for i in {1..10}
do
  python ../CCProject/create_random.py $1
  python ../CCProject/git_bisect.py $1
  rm ../CCProject/input_$1
  rm ../CCProject/sorted_$1
done
