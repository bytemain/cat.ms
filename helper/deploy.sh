#!/bin/sh -le

pwd
ls -lha

echo "install node_modules & hexo-cli"
yarn
yarn global add hexo-cli
echo ""

echo "config git user"
git config --global user.email "lengthmin@gmail.com"
git config --global user.name "Artin"
echo ""

echo "update libs"
yarn update
echo ""

echo "start deploy"
yarn d:pre
yarn d
echo "deploy done"
