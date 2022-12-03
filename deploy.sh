#!/bin/bash

sudo apt install curl

sudo useradd -g agent -s /bin/bash agent

sudo su - agent

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash

source ~/.bashrc

echo "Install at $NVM_DIR !"

nvm install 18.12.1

npm install

npm run start