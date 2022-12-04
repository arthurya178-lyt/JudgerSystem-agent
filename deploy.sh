#!/bin/bash

sudo apt install curl git

sudo apt install g++ gcc python3 openjdk-18-jre-headless

curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash - &&\
sudo apt-get install -y nodejs

sudo userdel -rf judger

sudo useradd -m -s /bin/bash judger

# sudo echo "judger ALL=(ALL:ALL) NOPASSWD:ALL"

su - judger -c " rm -rf /home/judger/agent ;  mkdir /home/judger/agent ; cd /home/judger/agent ; git clone http://github.com/arthurya178-pccu/JudgerSystem-agent.git . ; chmod 766 /home/judger/agent/script/*.sh ; /home/judger/agent/script/setup_environment.sh ; npm install ; npm run start"
