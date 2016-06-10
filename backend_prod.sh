#!/bin/bash

cp -r ./backend ../
babel ./backend/apis --out-dir ../backend/apis
babel ./backend/configs --out-dir ../backend/configs
babel ./backend/models --out-dir ../backend/models
babel ./backend/tools --out-dir ../backend/tools
babel ./backend/app.js -o ../backend/app.js
