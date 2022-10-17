---
title: SQLServer 不同 ODBC 驱动的区别
comments: true
toc: true
permalink: posts/sqlserver-odbc-driver/
date: 2020-12-29 13:42:31
categories: SQLServer
tags:
  - ODBC
  - pyodbc
---

<style>
table {
    word-break: keep-all;
}
</style>

使用 pyodbc + sqlalchemy 连接 SQLServer 数据库的时候遇到一个报错： `[IM002] [Microsoft][ODBC 驱动程序管理器] 未发现数据源名称并且未指定默认驱动程序 (0) (SQLDriverConnect)`。

查阅 [sqlalchemy mssql+pyodbc 数据库文档](https://docs.sqlalchemy.org/en/14/dialects/mssql.html#module-sqlalchemy.dialects.mssql.pyodbc) 后发现：

需要装 ODBC 驱动。并且如果你要是用 hostname 方式来连接数据库的话，还需要指定驱动名字，但是发现有好多种 driver，一个 driver 还有不同的名字。于是研究了一番。

<!-- more -->

## 怎么这么多驱动

引用并重新编辑一下 [Microsoft SQL Server 的驱动程序历史记录 - SQL Server | Microsoft Docs](https://docs.microsoft.com/zh-cn/sql/connect/connect-history?view=sql-server-ver15#odbc) 中一段很清晰的描述：

有三代不同的 Microsoft ODBC Driver for SQL Server。

- 第一代“SQL Server”ODBC 驱动程序仍作为 [Windows Data Access 组件](https://docs.microsoft.com/en-us/sql/connect/connect-history?view=sql-server-ver15#microsoft-or-windows-data-access-components) 的一部分提供。对于新开发的程序，不建议使用此驱动程序。
- 从 SQL Server 2005 开始，[SQL Server Native Client](#SQL-Server-Native-Client) 包含一个 ODBC 接口，并且它是 SQL Server 2005 至 SQL Server 2012 中随附的 ODBC 驱动程序。 对于新开发，也不建议使用此驱动程序。
- 在 SQL Server 2012 之后，[Microsoft ODBC Driver for SQL Server](#Microsoft-ODBC-Driver-for-SQL-Server) 驱动程序随最新的服务器功能进行更新。

## SQL Server Native Client

SQL Server 2005 引入了 SQL Server Native Client 的支持，可用于 ODBC 的连接。

SQL Server 2005 至 SQL Server 2012 都在进行 SQL Server Native Client（通常缩写为 SNAC）的开发。SQL Server Native Client 10.0 跟着 SQL Server 2008 一起发版。SQL Server Native Client 11.0 跟着 SQL Server 2012 一起发版。

可以在这儿下载到所有的历史版本：[Download SQL Server Native Client - ConnectionStrings.com](https://www.connectionstrings.com/download-sql-server-native-client/)

想使用的话找到最新版的安装就行，驱动都是向前兼容的。需要注意的就是不同的 SQLServer 版本设置的驱动名字：

- `Driver={SQL Server Native Client}` (SQL Server 2005)
- `Driver={SQL Server Native Client 10.0}` (SQL Server 2008)
- `Driver={SQL Server Native Client 11.0}` (SQL Server 2012 及之后)

但是微软[在 13 年宣布了新版的 ODBC Driver](https://docs.microsoft.com/zh-cn/archive/blogs/sqlnativeclient/introducing-the-new-microsoft-odbc-drivers-for-sql-server)，也就是下面这个。在 17 年放弃了对 SNAC 的开发，被下面这个驱动取代，新版的驱动性能更好，支持 SQLServer 2012 之后的数据库的新特性。

## Microsoft ODBC Driver for SQL Server

[最新版驱动下载地址](https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server) &nbsp; | &nbsp; [历史版本驱动下载地址](https://docs.microsoft.com/zh-cn/sql/connect/odbc/windows/release-notes-odbc-sql-server-windows?view=sql-server-ver15#previous-releases)

使用方法也是安装好驱动程序，设置驱动名字。

驱动名字格式：

- `Driver={ODBC Driver XX for SQL Server}` (XX 是你安装的驱动版本的名字)

| 数据库版本&nbsp;&#8594;<br />&#8595; 驱动程序版本 | Azure SQL Database | Azure Synapse Analytics | Azure SQL 托管实例 | SQL Server 2019 | SQL Server 2017 | SQL Server 2016 | SQL Server 2014 | SQL Server 2012 | SQL Server 2008 R2 | SQL Server 2008 | SQL Server 2005 |
| ------------------------------------------------- | ------------------ | ----------------------- | ------------------ | --------------- | --------------- | --------------- | --------------- | --------------- | ------------------ | --------------- | --------------- |
| 17.6                                              | 是                 | 是                      | 是                 | 是              | 是              | 是              | 是              | 是              |                    |                 |                 |
| 17.5                                              | 是                 | 是                      | 是                 | 是              | 是              | 是              | 是              | 是              |                    |                 |                 |
| 17.4                                              | 是                 | 是                      | 是                 | 是              | 是              | 是              | 是              | 是              |                    |                 |                 |
| 17.3                                              | 是                 | 是                      | 是                 | 是              | 是              | 是              | 是              | 是              | 是                 | 是              |                 |
| 17.2                                              | 是                 | 是                      | 是                 |                 | 是              | 是              | 是              | 是              | 是                 | 是              |                 |
| 17.1                                              | 是                 | 是                      | 是                 |                 | 是              | 是              | 是              | 是              | 是                 | 是              |                 |
| 17.0                                              | 是                 | 是                      | 是                 |                 | 是              | 是              | 是              | 是              | 是                 | 是              |                 |
| 13.1                                              |                    |                         |                    |                 | 是              | 是              | 是              | 是              | 是                 | 是              |                 |
| 13                                                |                    |                         |                    |                 |                 | 是              | 是              | 是              | 是                 | 是              |                 |
| 11                                                |                    |                         |                    |                 |                 |                 | 是              | 是              | 是                 | 是              | 是              |

<p align="center">
SQL 版本兼容性 | 表格来自 <a href="https://docs.microsoft.com/zh-cn/sql/connect/odbc/windows/system-requirements-installation-and-driver-files?view=sql-server-ver15#sql-version-compatibility">Microsoft</a>
</p>

## 总结

`ODBC Driver for SQL Server` 的性能更好，新版本有很多优化，有新特性，2021 年做开发就要选他。

不同的驱动版本的支持的数据库版本也不同。请你一定要看好自己的 SQLServer 版本，去安装对应版本的驱动，然后配置好驱动名字。

还发现了一个非常棒的网站：[ConnectionStrings](https://www.connectionstrings.com/)

> ConnectionStrings.com helps developers connect software to data. It's a straight to the point reference about connection strings, a [knowledge base](https://www.connectionstrings.com/kb/) of articles and database connectivity content and a host of [Q & A forums](https://www.connectionstrings.com/questions/) where developers help each other finding solutions.

ConnectionStrings.com 帮助开发人员将软件连接到数据库。它是一个关于连接字符串的直接参考、一个数据库连接内容和文章的知识库，同时也是一个问答论坛，开发人员可以在这里互相帮助寻找解决方案。

## 参考链接

- [sql server - Differences Between Drivers for ODBC Drivers - Stack Overflow](https://stackoverflow.com/questions/39440008/differences-between-drivers-for-odbc-drivers)
- [Windows 上的 ODBC Driver for SQL Server 发行说明 - SQL Server | Microsoft Docs](https://docs.microsoft.com/zh-cn/sql/connect/odbc/windows/release-notes-odbc-sql-server-windows?view=sql-server-ver15#previous-releases)
- [Installing - SQL Server Native Client | Microsoft Docs](https://docs.microsoft.com/en-us/sql/relational-databases/native-client/applications/installing-sql-server-native-client?view=sql-server-ver15)
- [Driver history for Microsoft SQL Server - SQL Server | Microsoft Docs](https://docs.microsoft.com/en-us/sql/connect/connect-history?view=sql-server-ver15#odbc)
- [系统要求、安装和驱动程序文件 - SQL Server | Microsoft Docs](https://docs.microsoft.com/zh-cn/sql/connect/odbc/windows/system-requirements-installation-and-driver-files?view=sql-server-ver15#sql-version-compatibility)
