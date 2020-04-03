#!/bin/sh -le

pwd
ls -lha

echo "install npm & hexo-cli"
npm install
npm install -g hexo-cli
echo ""

echo "config git user"
git config --global user.email "lengthmin@gmail.com"
git config --global user.name "Artin"

echo "git version"
git --version
echo "node version"
node --version
echo "npm version"
npm --version
echo "hexo version"
hexo --version
echo ""

echo "generate secret"
npm run secret
cat ./_config.yml
echo ""

echo "update libs"
npm run update
echo ""

echo "start deploy"
npm run d

echo "deploy done"
