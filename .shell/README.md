这是几个脚本文件，可以在linux系统下使用。

所有文件包括：
```
.
├── .shell
└── hexo

.shell
├── README.md
├── deploy.sh
├── push.sh
```
首先在根目录给`hexo`可执行权限: `chmod +x hexo`
可以在根目录下运行`./hexo`
命令行会输出
```
Please select an item
**************************************
*   0.   Both 1 & 2                  *
*   1.   Deploy the blog.            *
*   2.   Backup the blog's source.   *
*   *.   Exit.                       *
**************************************
```

就可以选择备份或者部署博客。