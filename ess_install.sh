sudo apt-get update
sudo apt-get install -y build-essential
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install babel-preset-es2015 -g
sudo npm install -g babel-cli
npm install babel-preset-es2015 --no-bin-links --save
