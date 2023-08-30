#!/bin/bash
# import all parameter from environment shell

readonly BASE_ROOT=$(dirname $0)
source $BASE_ROOT/environment_argument.sh


readonly SESSION_PATH=$BASE_ROOT/$area_folder_name/$1

# clear session directory if exist
if [ -d $SESSION_PATH ] || [ -f $SESSION_PATH ]
then
    rm -rf $SESSION_PATH
fi

# Create session menu
mkdir $SESSION_PATH

# Create session menu detail
mkdir $SESSION_PATH/$compile_folder_name
mkdir $SESSION_PATH/$result_folder_name
