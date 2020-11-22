#!/bin/sh -le

echo "config git user"
git config --global user.email "lengthmin@gmail.com"
git config --global user.name "Artin"
echo ""

echo "update libs"
yarn update
echo ""

echo "start deploy"
yarn deploy
echo "deploy done"
