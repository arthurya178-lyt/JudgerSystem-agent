#!/bin/bash
readonly BASE_ROOT=$(dirname $0)
cd $BASE_ROOT


# import all parameter from environment shell
source ./environment_argument.sh


# move to execute_environment
cd $execute_path


# clear any document in the output and input folder
rm -rf $compile_folder/*
rm -rf $export_folder/*
rm -rf $result_folder/*
rm -rf $execute_path/*.*
# #
