#!/bin/bash
readonly BASE_ROOT=$(dirname $0)
cd $BASE_ROOT


source ./environment_argument.sh

# clear directory

# clear execute environment folder if folder exist
rm -rf $execute_environment_path

# rebuild execute environment folder
mkdir $execute_environment_path
# change directory to execute environment
cd $execute_environment_path
mkdir $sourcecode_path
mkdir $export_file_path
mkdir $result_file_path

