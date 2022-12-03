#!/bin/bash
# declare global argument to set compiling argument

readonly script_root=$(dirname $0)

readonly execute_path="$script_root/execute_dir"
readonly compile_folder="$execute_path/compile"
readonly export_folder="$execute_path/output"
readonly result_folder="$execute_path/result"
readonly compile_timeout="10s"
readonly execute_timeout="10s"
