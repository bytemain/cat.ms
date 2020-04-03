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

echo "git version"
git --version
echo "node version"
node --version
echo "npm version"
yarn --version
echo "hexo version"
hexo --version
echo ""

echo "generate secret"
yarn secret
cat ./_config.yml
echo ""

echo "update libs"
yarn update
echo ""

echo "start deploy"
yarn d

echo "deploy done"
