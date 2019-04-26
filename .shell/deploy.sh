#! /bin/bash
echo "deploy"
sh clean.sh
hexo g -d
echo "deploy done."