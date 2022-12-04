#!/bin/bash
readonly BASE_ROOT=$(dirname $0)
cd $BASE_ROOT

# import all parameter from environment shell
source ./environment_argument.sh
readonly current_directory=$(pwd)

# move to execute_environment
cd $execute_environment_path

identify_name=$1
input_file=$2


# this program is use to compile Python source code and execute it
# it require these parameter
# 1. identify name (ex.answer,input)
# 2. input data file path

# this program exit code describe:
# 0. execute work successfully
# 1. compile error, it interrupted by timeout
# 2. missing executable program
# 3. execute progress interrupted by timeout


# back to execute directory
cd $execute_path

# execute output from compile cpp file
if [ -f $export_folder/$identify_name.out ]
	then
		if [ -z $input_file ]
			then
				/usr/bin/time --output=$export_folder/$identify_name.exec.time -f "TimeUsed: %E\nMaxMemoryUsed: %M" timeout --preserve-status $execute_timeout python3 $compile_folder/*.py > $result_folder/$identify_name.result 2>&1
			else
				/usr/bin/time --output=$export_folder/$identify_name.exec.time -f "TimeUsed: %E\nMaxMemoryUsed: %M" timeout --preserve-status $execute_timeout $compile_folder/*.py < $input_file > $result_folder/$identify_name.result 2>&1
		fi
	else
		exit 2
fi

# compile_status 0: execute successfully , 1: it stop by timeout , 130: program interrupted by user ctrl+c , 143: execute interrupted
execute_status=$?

if [ $execute_status -ne 0 ]
then
	exit 3
fi
