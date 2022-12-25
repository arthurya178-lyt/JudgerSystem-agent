
sudo apt update

sudo apt install curl time

sudo apt install g++ gcc python3 default-jre default-jdk

curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash - &&\
sudo apt-get install -y nodejs

sudo apt install npm

chmod 744 ./script/*.sh
 
rm -rf ./script/sessions

mkdir ./script/sessions

npm install

