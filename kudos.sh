#!/bin/bash

echo "Installing dependencies..."

npm install

echo "building your cohort people.json from google spreadsheet"

node createPeople.js

echo "Running LinkedIn Script..."

node linked-in.js

echo "Running GitHub Script..."

node github.js

echo "Running GitHub Projects Script..."

node github-projects.js