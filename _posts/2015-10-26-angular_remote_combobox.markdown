---
layout: post
title: 基于angularjs的remote combobox实现
description : 基于angularjs的remote combobox实现
category: [angularjs]
tags: [angularjs, combobox, directive, remote]
---


-----------------------


<div class="toc">
			
</div>

##前言
在项目中需要用到remote combobox控件的情况， 大家都知道什么是 [combobox](combobox). 那什么叫remote combobox呢？    
所谓remote 就是指combobox的数据源需要通过远程调用，向数据服务发起请求获得，在请求过程中，combobox控件需要有可视化的UI来向用户表示我正在获取数据，需要您等一等。

本文所编写的控件参考了 [kendo UI](http://www.telerik.com/kendo-ui) 的combobox的效果： [Server filtering](http://demos.telerik.com/kendo-ui/combobox/serverfiltering)


##如何使用
###1.引入基本库： jquery 和 angularjs
	
	<script src="/path/to/jquery-1.11.3.js"></script>
	<script src="/path/to/angularjs_1.2.2.js"></script>
	
###2.引入本文编写的remote-combobox的js和css代码
 
	<script src="/path/to/angular-remote-combobox.js"></script>
	<link rel="stylesheet" type="text/css" href="/path/to/angular-remote-combobox.css"/>

###3.在脚本里使用
 html：
   
    <body ng-app="ngTest" ng-controller="ctrl">
		<combobox data-url="abcd"></combobox>
	</body>
	
 注意： 这里 data-url 是远端获取数据的url地址，其返回数据格式应该如下：
 
	[
		{ name : "漩涡1" , value : "18"},
		{ name : "漩涡2" , value : "166"},
		{ name : "漩涡5" , value : "13"},
		{ name : "漩涡3" , value : "15"},
		{ name : "漩涡11" , value : "615"},
		{ name : "漩涡23" , value : "14"},
		{ name : "漩涡1" , value : "123"},
		{ name : "漩涡23" , value : "11"}
	];
 说白了是一个json数组，其中的item必须带有name属性，用来作为内容展示。
 
 javascript:
 
	<script type="text/javascript">
		angular.module("ngTest",["combobox"]).controller("ctrl",["$scope",function($scope){
			//监听combobox选择改变事件
			$scope.$on("comboBoxSelectChanged",function(event,item){
				alert("选择了："  + JSON.stringify(item));
			});
		}]);
	</script>
	
###4.demo效果:
 
<div ng-app="ngTest" ng-controller="ctrl">
	<combobox data-url="abcd" data-server="comboboxDataSource"></combobox>
</div>
<script src="{{  "/js/angularjs_1.2.2.js"   |  prepend: site.baseurl }}"></script>
<script src="{{ "/js/angularjs-directives/angular-remote-combobox.js" | prepend: site.baseurl}}"></script>
<script type="text/javascript">
	angular.module('ngTest',['combobox']).controller('ctrl',['$scope',function($scope){
		//监听combobox选择改变事件
		$scope.$on('comboBoxSelectChanged',function(event,item){
			alert("选择了："  + JSON.stringify(item));
		});
	}]);
</script>
<link rel="stylesheet" type="text/css" href="{{ "/js/angularjs-directives/styles/angular-remote-combobox.css" | prepend: site.baseurl}}"/>

注意： demo里的 data-url设置为“abcd”这是错误的，其实demo里使用了一个自定义服务 `comboboxDataSource` 来模拟远端数据请求。如下：

	<div ng-app="ngTest" ng-controller="ctrl">
		<combobox data-url="abcd" data-server="comboboxDataSource"></combobox>
	</div>
定义combobox测试用的数据源 模拟远端数据 (定义一个服务)
	
	combobox.factory('comboboxDataSource', ['$q',function($q){
		var comboboxDataSource = {};
		comboboxDataSource.getData = function(){
			var comboboxDataSourceList = [
				{ name : "漩涡1" , value : "18"},
				{ name : "漩涡2" , value : "166"},
				{ name : "漩涡5" , value : "13"},
				{ name : "漩涡3" , value : "15"},
				{ name : "漩涡11" , value : "615"},
				{ name : "漩涡23" , value : "14"},
				{ name : "漩涡1" , value : "123"},
				{ name : "漩涡23" , value : "11"}
			];
			
			var deferred = $q.defer();
			setTimeout(function(){
				deferred.resolve(comboboxDataSourceList);
			},1000);
			
			return deferred.promise;
		};
		return comboboxDataSource;
	}]);
如果要使用真实的url来获取数据，则需要正确填写`data-url`,并且移除`data-server`。

## github 地址
//提供源码和demo下载，[点此链接](....) ,还没上传，待续。。。。


