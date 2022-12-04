#!/bin/bash

readonly BASE_ROOT=$(dirname $0)
cd $BASE_ROOT

source ./environment_argument.sh

echo $0
echo $BASE_ROOT

echo $(pwd)

# clear directory

# clear execute environment folder if folder exist
rm -rf $execute_path

# rebuild execute environment folder
mkdir $execute_path
# change directory to execute environment
cd $execute_path
mkdir $compile_folder
mkdir $export_folder
mkdir $result_folder
