#!/bin/bash
echo "Cleaning up..."
rm -rf node_modules

echo "Install up..."
npm install

echo "Building..."
npm run build

echo "Compression..."
tar zcvf dist.tar.gz ./dist/

echo "Task completed!"