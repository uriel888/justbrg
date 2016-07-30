#!/bin/bash
babel backend/crawler.js -o ../crawler/crawler.js
cp backend/tools/hotelscombinedFileNameConverter.json ../crawler/tools/hotelscombinedFileNameConverter.json
cp ./backend/tools/SPGCONVERTER.json ../crawler/tools/SPGCONVERTER.json
