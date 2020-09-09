#!/bin/bash

echo "Installing dependencies..."

npm install


read -p 'Please enter your LinkedIn username: ' lUsername

read -sp 'Please enter your LinkedIn password: ' lPassword

echo " "

read -p 'Please enter your GitHub username: ' gUsername

read -sp 'Please enter your GitHub password: ' gPassword

echo " "

echo "Running LinkedIn Script..."

USERNAME=$lUsername PASSWORD=$lPassword node linked-in.js

echo "Running GitHub Script..."

USERNAME=$gUsername PASSWORD=$gPassword node github.js

echo "Running GitHub Projects Script..."

USERNAME=$gUsername PASSWORD=$gPassword node github-projects.js