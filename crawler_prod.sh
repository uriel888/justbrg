#!/bin/bash
babel backend/crawler.js -o ../crawler/crawler.js
cp backend/tools/hotelscombinedFileNameConverter.json ../crawler/tools/hotelscombinedFileNameConverter.json
