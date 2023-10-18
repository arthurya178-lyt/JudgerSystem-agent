
sudo apt update

sudo apt install -y curl time

sudo apt install -y g++ gcc python3 default-jre default-jdk

# This script is used for Ubuntu and install version 18 nodejs
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

NODE_MAJOR=18
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

sudo apt-get update
sudo apt-get install nodejs npm -y

chmod 744 ./script/*.sh
 
rm -rf ./script/sessions

mkdir ./script/sessions

npm install

