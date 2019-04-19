hexo clean

git add -f -A .

str=`date '+%c'`

git commit -am "Meow~  ${str}"

git push blog backup -f
