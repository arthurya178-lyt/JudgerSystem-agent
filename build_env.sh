sudo apt install curl git

sudo apt install g++ gcc python3 openjdk-18-jre-headless openjdk-18-jdk-headless

curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash - &&\
sudo apt-get install -y nodejs

rm -rf ./script/execute_dir ;
 
chmod 700 ./script/*.sh
 
rm -rf ./script/execute_dir

mkdir ./script/execute_dir
mkdir ./script/execute_dir/compile
mkdir ./script/execute_dir/output
mkdir ./script/execute_dir/result

npm install

