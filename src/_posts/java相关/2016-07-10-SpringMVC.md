---
layout: post
title: SpringMVC工作原理
date: 2016-07-10 
categories: java
tags:
  - SpringMVC 
---
* content
{:toc}

 Spring的模型-视图-控制器（MVC）框架是围绕一个DispatcherServlet来设计的，这个Servlet会把请求分发给各个处理器，并支持可配置的处理器映射、视图渲染、本地化、时区与主题渲染等，甚至还能支持文件上传。
 
 <!-- more -->
 
## 运行原理
	1.客户端的请求统一发送到dispatchServlet
	2.dispatchServlet查找一个或者多个RequestMapping找到对应的Controller处理器,然后返回给dispatchServlet
	3.根据返回的处理器,dispatchServlet找到合适的处理器适配器handlerAdpater
	4.处理器适配器handlerAdpater会去执行处理器,处理器执行前会进行一系列处理(数据转换,数据绑定,数据校验等),然后开始执行Controller中相关业务逻辑
	5.Controller执行完后会返回ModelAndView给dispatchServlet
	6.dispatchServlet将ModelAndView交给试图解析器处理找到ModelAndView指定的视图
	7.视图将结果展示到客户端
	
## 工作流程图
[![](http://7xt682.com2.z0.glb.clouddn.com/springmvc.JPG)](http://7xt682.com2.z0.glb.clouddn.com/springmvc.JPG)