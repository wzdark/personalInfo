---
layout: post
title: 表达式解析器
description : 表达式解析器
category: [java]
tags: [java, expression parser]
---


<div class="toc">
			
</div>

##前言
由于项目需要做了一个简单的表达式解析器。可作为规则引擎的基础。


##支持功能

1. 支持+-*/四则运算，
2. 支持>,>=,<,<=,!=,==,&,|,!逻辑运算。
3. 支持三目运算符'?:'，输入

		(1<3)?4+3:5	
输出	
		
		7
4. 支持不带上下文的计算， 输入
	
		(4+2)/(3-1)
输出
		
		6
5. 支持带上下文的计算， 输入
		
		(a+b+c)==3 
	以及上下文
	
		{a:1,b:1,c:1} 
	
	输出
	
		true 

6. 支持表达式嵌套， 输入
	
		(true?(4-2>3?4:5):1)-1
输出

		4
		
##思路分享

1. 分词（tokenize）		
	input： `"(1+2)==3"` , outinput : `[(,1,+,2,),==,3]`
	
2. 生成逆波兰表达式	([reverse polish notation](https://en.wikipedia.org/wiki/Reverse_Polish_notation))		
	input: `[(,1,+,2,),==,3]` , output: `[1,2,+,3,==]`

3. 计算逆波兰表达式		
	input: `[1,2,+,3,==]` , output: `true`

##项目的git地址
<script src='https://git.oschina.net/wangzhuoa/ExpressionParser/widget_preview'></script>

<style>
.pro_name a{color: #4183c4;}
.osc_git_title{background-color: #d8e5f1;}
.osc_git_box{background-color: #fafafa;}
.osc_git_box{border-color: #ddd;}
.osc_git_info{color: #666;}
.osc_git_main a{color: #4183c4;}
</style>


	


