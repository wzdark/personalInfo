---
layout: post
title: JS解析查询字符串 parseQueryString
description : JS解析查询字符串 parseQueryString
category: [前端]
tags: [javascript, 笔试]
---

---------------------------

最近项目组招前端有一道笔试题是这样的：
编写一个函数(parseQueryString)将URL参数解析成一个对象。
该题的关键是要处理特殊字符 **'?'** **'&'**  **'='** **'#'**。

 - **'?'**代表后面的字符串全是查询字符串
 - **'&'**代表参数分割符
 - **'='**代表参数的名称和值的分隔符,第一个=号后面的部分全部为值
 - **'#'**代表后面的部分不会作为请求发送到服务端

例如：

1. 正常输入 : `http://localhost/#api?name=wz&age=12`  
输出 : `{name:"wz",age=12}`  
2. 特殊输入 : `http://localhost:8000/api?name=wz=?1&age?=18#=2`  
输出 : `{"name":"wz=?1","age?":"18"}` 
3. 特殊输入 : `""`  
输出 : `{}` 

代码：

	function parseQueryString(url){
		var arr;
		var res = {};
		//#符号之后的值称为hash，都不会加到request请求中去
		url = url.split('#')[0];
		//获取queryString 第一个？号后面的全是查询字符串
		arr = url.split('?');
		arr.shift();
		var queryStr = arr.join('?');
		//查询字符串为空直接返回 避免出现这样的返回值{"":""}
		if (queryStr.trim().length == 0){
			return res;
		}
		
		//获取参数
		arr = queryStr.split('&');
		for (var i = 0; i <  arr.length; i++) {
			var itemArr = arr[i].split('=');
			//第一个=号之前的是name 后面的全是值
			var name = itemArr.shift();
			var value = itemArr.join('=');
			res[name] = value;
		}
		return res;
	}



