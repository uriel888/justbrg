#!/bin/bash

cp -r ./crawler ../
babel ./crawler/tools --out-dir ../crawler/tools
babel ./crawler/app.js -o ../crawler/app.js
