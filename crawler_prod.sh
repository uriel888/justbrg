#!/bin/bash

cp -r ./crawler ../
babel ./crawler/tools --out-dir ../crawler/tools
babel ./crawler/apis --out-dir ../crawler/apis
babel ./crawler/app.js -o ../crawler/app.js
