sudo apt install curl git

sudo apt install g++ gcc python3 openjdk-18-jre-headless openjdk-18-jdk-headless

curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash - &&\
sudo apt-get install -y nodejs

sudo apt-get install npm

chmod 744 ./script/*.sh
 
rm -rf ./script/sessions

mkdir ./script/sessions

npm install

