---
layout: post
title: 基于angularjs的select控件, 支持单选多选
description : 基于angularjs的select控件
category: [前端]
tags: [javascript, angularjs, select]
---


-----------------------

<link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.4/css/bootstrap.css">
<link rel="stylesheet" href="https://cdn.bootcss.com/select2/3.5.1/select2.min.css">
<script src="http://cdn.bootcss.com/angular.js/1.3.0/angular.min.js" type="text/javascript" charset="utf-8"></script>
<script src="https://cdn.bootcss.com/select2/3.5.1/select2.min.js" type="text/javascript" charset="utf-8"></script>
<script src="{{"/js/layer/layer.js" | prepend: site.baseurl }}" type="text/javascript" charset="utf-8"></script>
<script src="{{"/js/angularjs-directives/angular-select.js" | prepend: site.baseurl }}" type="text/javascript" charset="utf-8"></script>
<style>
.select2-container .select2-choice{
	margin: 0;
}
</style>

<div class="toc">
			
</div>

##前言
由于项目需要做了一个基于angularjs的select控件, 支持单选多选,和非空验证。


##效果展示
<form name="myForm" ng-app="ngTest" ng-controller="ctrl">
	
	<div class="row">
		<div class="col-md-12">
			<div class="alert alert-info ">
				<div class="alert alert-success">
					单选: <angular-select placeholder="请选择" require="必须要填啊" tip-direction="1" submit-btn-id="submitBtn"  ng-model="selectedModel2.a" select="selectChange2(value)" multiple="false" ng-data-source="dataList" ></angular-select>	
					当前选择： <span ng-bind="selectedModel2.a"></span>
				</div>
				代码：
				<pre>&lt;angular-select require="必须要填啊" tip-direction="1" submit-btn-id="submitBtn"  ng-model="selectedModel2" select="selectChange2()" multiple="false" ng-data-source="dataList.a" &gt; &lt; /angular-select&gt; </pre>
				
			</div>
		</div>
		
		<div class="col-md-12">
			<div class="alert alert-info ">
				<div class="alert alert-success">
					多选: <angular-select disabled="false" placeholder="请选择" require="必须要填啊" tip-direction="1" submit-btn-id="submitBtn"  ng-model="selectedModel" select="selectChange(value)" multiple="true" ng-data-source="dataList" ></angular-select>	
					当前选择： <span ng-bind="selectedModel | json"></span>
				</div>
				代码：
				<pre>&lt;angular-select placeholder="请选择" require="必须要填啊" tip-direction="1" submit-btn-id="submitBtn"  ng-model="selectedModel" select="selectChange()" multiple="true" ng-data-source="dataList.a" &gt; &lt; /angular-select&gt; </pre>
				
			</div>
		</div>
	</div>
	
	<div class="alert alert-info ">
		<input type="button" name="" id="submitBtn" value="提交" ng-click="submit();"/>	
	</div>
	
	
</form>
		
##控制器代码
<div class="alert alert-info">
			demo controller:
			<pre>
angular.module('ngTest',['angularSelect']);
		
angular.module('ngTest').controller('ctrl',['$scope',function($scope){
	
	$scope.dataList = [
		{name:"wz",value:1},
		{name:"Ab",value:2},
		{name:"333",value:3},
	];
	$scope.bb = "wwz";
	$scope.selectedModel =[ $scope.dataList[0] ];
	$scope.selectedModel2 = {};
	$scope.selectedModel2.a = null;
	$scope.selectChange = function(item){
		console.info("select :" +　JSON.stringify(item));
	};
	$scope.selectChange2 = function(item){
		console.info("select :" +　JSON.stringify(item));
	};
	$scope.submit = function(){
		if ($scope.myForm.$valid){
			alert("do submit!");
		}
		else{
			alert("表单有错误！");
		}
	}
}]);</pre>
</div>

##需要
<div class="alert alert-info">
	
	<ul>
		<li>
			angular.js v1.3 +  <br/>
			<code>http://cdn.bootcss.com/angular.js/1.3.0/angular.min.js</code>
		</li>
		<li>
			jquery.js v1.11 + <br/>
			<code>http://cdn.bootcss.com/jquery/1.11.1/jquery.min.js</code>
		</li>
		<li>
			select2.js v3.5 + <br/>
			<code>https://cdn.bootcss.com/select2/3.5.1/select2.min.js</code>
			<code>https://cdn.bootcss.com/select2/3.5.1/select2.min.css</code>
		</li>
		<li>
			layer.js v2.1 + （修改过源码，请从本站下载） <br/>
			<a href="{{"/js/layer/layer.js" | prepend: site.baseurl }}">点击这里</a>
		</li>
		<li>
			angular-select.js v1.0 + <br/>
			<a href="{{"/js/angularjs-directives/angular-select.js" | prepend: site.baseurl }}">点击这里</a>
		</li>
	</ul>
</div>


		
##一些说明
1. 使用<code>'require="必须要填哦"'</code>或者<code>'require'</code> 使表单成为必填项;并且要指定'submit-btn-id'的属性为表单提交按钮的id。

2.  使用<code>tip-direction="1"</code> 设置错误提示弹出方向，1、2、3、4 分别代码上、右、下、左.

3. 使用<code>disabled="true"</code> 控制表单为只读项

4. 使用<code>multiple="true"</code> 控制表单为多选

5. 使用<code>placeholder="请选择"</code> 控制表单的提示信息

6. 单选和多选的区别：

	注意： 单选模式绑定的是选择值的value
	
		1
		
	多选模式绑定的是一个数组对象:
	
		[{value:1,name:"wz"}]
	
		
<script type="text/javascript">
	angular.module('ngTest',['angularSelect']);
		
	angular.module('ngTest').controller('ctrl',['$scope',function($scope){
		
		$scope.dataList = [
			{name:"wz",value:1},
			{name:"Ab",value:2},
			{name:"333",value:3},
		];
		$scope.bb = "wwz";
		$scope.selectedModel =[ $scope.dataList[0] ];
		$scope.selectedModel2 = {};
		$scope.selectedModel2.a = null;
		$scope.selectChange = function(item){
			console.info("select :" +　JSON.stringify(item));
		};
		$scope.selectChange2 = function(item){
			console.info("select :" +　JSON.stringify(item));
		};
		$scope.submit = function(){
			if ($scope.myForm.$valid){
				alert("do submit!");
			}
			else{
				alert("表单有错误！");
			}
		}
	}])
	
	
	
</script>


	


