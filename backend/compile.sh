#!/bin/bash

babel init_src.js --out-file init.js

#Compile apis
cd ./apis/
./compile.sh
cd ..

#Compile Mongodb Models
cd ./models/
./compile.sh
cd ..
