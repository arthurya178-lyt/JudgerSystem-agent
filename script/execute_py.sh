#!/bin/bash
readonly SCRIPT_PATH=$(dirname $0)

# import all parameter from environment shell
source $SCRIPT_PATH/environment_argument.sh

target_folder=$1
identify_name=$2
input_file=$3

# here's argument is just for rename path name
readonly COMPILE_FOLDER=$target_folder/$compile_folder_name
readonly RESULT_FOLDER=$target_folder/$result_folder_name


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
cd $COMPILE_FOLDER

# execute output from compile py file

if [ -z $input_file ]
	then
		/usr/bin/time --output=$RESULT_FOLDER/$identify_name.exec.time -f "TimeUsed: %E\nMaxMemoryUsed: %M" timeout --preserve-status $execute_timeout python3 $COMPILE_FOLDER/*.py > $RESULT_FOLDER/$identify_name.result 2>&1
	else
		/usr/bin/time --output=$RESULT_FOLDER/$identify_name.exec.time -f "TimeUsed: %E\nMaxMemoryUsed: %M" timeout --preserve-status $execute_timeout python3 $COMPILE_FOLDER/*.py < $input_file > $RESULT_FOLDER/$identify_name.result 2>&1
fi

# compile_status 0: execute successfully , 1: it stop by timeout , 130: program interrupted by user ctrl+c , 143: execute interrupted
execute_status=$?

if [ $execute_status -ne 0 ]
then
	exit 3
fi
