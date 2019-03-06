# hexo 快捷脚本

这是几个脚本文件，可以在 linux 系统下使用。
win 下可以使用`cmder`,`bash`等工具

所有文件包括：

```plain
.
├── .shell/
  ├── README.md
  ├── deploy.sh
  ├── push.sh
└── hexo
```

首先在根目录给`hexo`可执行权限: `chmod +x hexo`
可以在根目录下运行`./hexo`
命令行会输出

```plain
"Please select an item"
"**************************************"
"*   1.   Both 2 & 3                  *"
"*   2.   Deploy the blog.            *"
"*   3.   Backup the blog's source.   *"
"*   4.   Hexo server.                *"
"*   *.   Exit.                       *"
"**************************************"
```

就可以选择备份或者部署博客。
