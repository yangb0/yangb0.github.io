---
layout: post
title: linux多屏管理工具screen
date: 2019-07-22 
category: 服务器
tags: 
 	- screen 
---

   在Linux上开发，经常遇到远程窗口断开，重新连接后，之前的操作都丢失了，这里介绍一个工具Screen。它可以为你保存一个会话，下次连接该会话即可恢复当前工作环境，很方便。
 <!-- more -->

## 安装screen   

        yum install screen -y 

## 修改配置

  在/etc/screenrc中加入如下代码，启动screen（如果已经启动就全部exit掉重新启动screen）即可生效：
  
    允许设置窗口标题
       caption always "%{.bW}%-w%{.rW}%n %t%{-}%+w %=%H %Y/%m/%d "

 

## screen常用命令及快捷键

    常用命令
    screen -S session_name // 新建一个名叫session_name的session，并马上进入
    screen -ls //列出当前所有的session
    screen -r session_name //恢复到 session_name 这个session，前提是已经是断开状态
    screen -d session_name //远程断开某个session
    screen -d -r session_name //结束当前session并回到session_name这个session
    screen -x session_name //连接到离线模式的会话（多窗口同步演示）
    
    常用快捷键
    Ctrl+a w //窗口列表
    Ctrl+a n //下一个窗口
    Ctrl+a p //上一个窗口
    Ctrl+a c //在当前screen会话中创建窗口
    Ctrl+a 0-9 //在第0个窗口和第9个窗口之间切换
    Ctrl+a Shift+a //修改当前窗口名称