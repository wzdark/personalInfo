---
layout: post
title: 基于angularjs的表单验证插件
description : 基于angularjs的表单验证插件，支持email，手机，座机，银行卡，正则表达式，自定义函数等验证方式。
category: [前端]
tags: [javascript, angularjs, validate]
---


-----------------------

<link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.4/css/bootstrap.css">
<script src="http://cdn.bootcss.com/angular.js/1.3.0/angular.min.js" type="text/javascript" charset="utf-8"></script>
<script src="{{"/js/layer/layer.js" | prepend: site.baseurl }}" type="text/javascript" charset="utf-8"></script>
<script src="{{"/js/angularjs-directives/ng-tip-validate.js" | prepend: site.baseurl }}" type="text/javascript" charset="utf-8"></script>

<div class="toc">
			
</div>

##前言
在项目中需要有统一的表单验证功能，和统一的验证格式。 考察了angularjs自带的表单验证功能，发现它不是很强大，需要开发者额外去判断$scope.formName.inputFieldName.$valid 的值
从而显示响应的错误提示，而且错误提示的html和css也要开发者去自己写。参考[这里](http://www.w3schools.com/angular/angular_validation.asp).

本文所做的插件基于易用性考虑，让开发者只需要简单的为表单加一个指令就能达到验证的效果，而且错误提示的样式是统一可配置的。


##效果展示
<form name='myform' ng-app="ngTest" ng-controller="ctrl">
		<div class="row">
			<div class="col-md-6">
				<div class="alert alert-info ">
					<div class="alert alert-success">
						name (非空): <input type="text" ng-model="name" id="name" ucc-require="名称必须填" ucc-tip-direction="3" submit-btn-id="submit"/>	
					</div>
					代码：
					<pre>&lt;input type="text" ng-model="name" id="name" ucc-require="名称必须填" ucc-tip-direction="3" submit-btn-id="submit"&gt; </pre>
					
				</div>
			</div>
			
			<div class="col-md-6">
				<div class="alert alert-info ">
					<div class="alert alert-success">
						email : <input type="text" ng-model="email" id="email" ucc-email ucc-require ucc-tip-direction="2" submit-btn-id="submit"/>
					</div>
					代码：
					<pre>&lt;input type="text" ng-model="email" id="email" ucc-email ucc-require ucc-tip-direction="2" submit-btn-id="submit"&gt; </pre>
					
				</div>
			</div>
		</div>
		
		<div class="row">
			<div class="col-md-6">
				<div class="alert alert-info">
					<div class="alert alert-success">
						phone : <input type="text" ng-model="phone" id="phone" ucc-phone ucc-require submit-btn-id="submit"/>
					</div>
					代码：
					<pre>&lt;input type="text" ng-model="phone" id="phone" ucc-phone ucc-require submit-btn-id="submit"&gt; </pre>
					
				</div>
			</div>
			<div class="col-md-6">
				<div class="alert alert-info">
					<div class="alert alert-success">
						Tel座机 : <input type="text" ng-model="tel" id="tel" ucc-tel ucc-require submit-btn-id="submit"/>
					</div>
					代码：
					<pre>&lt;input type="text" ng-model="tel" id="tel" ucc-tel ucc-require submit-btn-id="submit"&gt; </pre>
					
				</div>
			</div>
		</div>
		
		<div class="row">
			<div class="col-md-6">
				<div class="alert alert-info">
					<div class="alert alert-success">
						银行卡 : <input type="text" ng-model="bankCard" id="bankCard"   ucc-bank-card ucc-require submit-btn-id="submit"/>
					</div>
					代码：
					<pre>&lt;input type="text" ng-model="bankCard" id="bankCard"   ucc-bank-card ucc-require submit-btn-id="submit"&gt; </pre>
					
				</div>
			</div>
			<div class="col-md-6">
				<div class="alert alert-info">
					<div class="alert alert-success">
						最大长度和最小长度 : <input type="text" ng-model="number" id="number"   ucc-min-length="1" ucc-max-length="14" ucc-require submit-btn-id="submit"/>
					</div>
					代码：
					<pre>&lt;input type="text" ng-model="number" id="number" ucc-min-length="1" ucc-max-length="4" ucc-require submit-btn-id="submit"&gt; </pre>
					
				</div>
			</div>
		</div>
		
		<div class="row">
			<div class="col-md-6">
				<div class="alert alert-info">
					<div class="alert alert-success">
						正则表达式验证 : <input type="text" ng-model="number2" id="number2"   ucc-pattern="^1$" ucc-pattern-message="不符合规矩！"  submit-btn-id="submit"/>
					</div>
					代码：
					<pre>&lt;input type="text" ng-model="number2" id="number2"   ucc-pattern="^1$" ucc-pattern-message="不符合规矩！"  submit-btn-id="submit"&gt; </pre>
					
				</div>
			</div>
			<div class="col-md-6">
				<div class="alert alert-info">
					<div class="alert alert-success">
						远程验证 : <input type="text" ng-model="age" id="age" ucc-remote="/testCtrl/remoteTest" ucc-remote-data="remoteData" ucc-require submit-btn-id="submit"/>
					</div>
					代码：
					<pre>&lt;input type="text" ng-model="age" id="age"   ucc-remote="/testCtrl/remoteTest" uuc-remote-data="remoteData" ucc-require submit-btn-id="submit"&gt; </pre>
					<ul>
						<li>远程验证会发起ajax-post请求到 ucc-remote 指定的 地址.
						</li>
						<li>post参数是  uuc-remote-data （Controller中定义的对象），而本表单中的数值会附加到 uuc-remote_data 的 'value' 属性上
						</li>
						<li>返回数据结构为 “{success:true, msg:xxx, data:xxx}” . 其中success代码验证是否成功， 而msg代码验证失败需要显示的错误提示。
						</li>
					</ul>
					
				</div>
			</div>
		</div>
		
		<div class="row">
			<div class="col-md-6">
				<div class="alert alert-info">
					<div class="alert alert-success">
						自定义函数验证 : <input type="text" ng-model="number12"    ucc-validate-func="validateFun(value);"   submit-btn-id="submit"/>
					</div>
					代码：
					<pre>&lt;input type="text" ng-model="number12" id="number12"   ucc-validate-func="validateFun(value);"   submit-btn-id="submit"&gt; </pre>
					<pre>$scope.validateFun = function(input){
if ("wz" != input){
	return "必须是wz";
}
else{
	//验证成功返回0 或者 null 或者 false
	return 0;
}
}</pre>
				</div>
			</div>
			<div class="col-md-6">
				
			</div>
		</div>
		
		
		
		<div class="alert alert-info">
			<input type="button" name="" id="submit" value="submit" ng-click="submit();" />
			<!--ng-disabled='myform.$invalid'--> 
		</div>
		
	</form>
		
##控制器代码
<div class="alert alert-info">
			demo controller:
			<pre>
angular.module('ngTest',['ngTipValidate']).controller('ctrl',['$scope', 'ngTipValidateConfig',function($scope, ngTipValidateConfig){
	//修改ng-validate 的默认配置项
	ngTipValidateConfig.uccRequireMsg = "必须非空";
	
	
	$scope.name = "";
	$scope.email = "";
	$scope.phone = "";
	$scope.remoteData = {
		id : 1234,
		name : "wzggg"
	};
	$scope.validateFun = function(input){
		if ("wz" != input){
			return "必须是wz";
		}
		else{
			//验证成功返回0 或者 null 或者 false
			return 0;
		}
	}
	
	$scope.submit = function(){
		//提交前先验证表单是否正确
		if ($scope.myform.$valid){
			alert("do submit");	
		}
		else{
			alert('表单有错误');
		}
	};
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
			<code>http://cdn.bootcss.com/jquery/1.10.2/jquery.min.js</code>
		</li>
		<li>
			layer.js v2.1 + （修改过源码，请从本站下载） <br/>
			<a href="{{"/js/layer/layer.js" | prepend: site.baseurl }}">点击这里</a>
		</li>
		<li>
			ng-tip-validate.js v1.0 + <br/>
			<a href="{{"/js/angularjs-directives/ng-tip-validate.js" | prepend: site.baseurl }}">点击这里</a>
		</li>
	</ul>
</div>

##如何开始

1. 引入以上提到的基础类库，注意顺序不要错！
2. 在写页面的module的时候，引入`‘ngTipValidate’` 模块.		

		angular.module('ngTest',['ngTipValidate']);

3. 在html表单中加入 验证指令（ucc-xxx格式）， 并且指定表单提交按钮的id（submit-btn-id）：	

		<input type="text" ng-model="number12" id="number12"   ucc-validate-func="validateFun(value);"   submit-btn-id="submit" />
		
##一些说明

1. 表单验证指令的命名一般是 ucc-xxx 的格式，其中ucc 为我目前正在做的项目名称（u-cost-control U费控）.
2. 验证错误提示信息可以为每个表单分别指定 , 如`ucc-require="必须要填哦"` 。 或者是不指定值，使用默认提示 ， 如`ucc-require` 。 而默认提示信息可以按照如下代码修改：

		angular.module('ngTest',['ngTipValidate']).controller('ctrl',['$scope','ngTipValidateConfig',function($scope,ngTipValidateConfig){
			//修改ng-validate 的默认配置项
			ngTipValidateConfig.uccRequireMsg = "必须非空";
			ngTipValidateConfig.uccPhoneMsg = "手机格式错误";
			ngTipValidateConfig.uccTelMsg = "电话格式错误";
			ngTipValidateConfig.uccEmailMsg = "邮箱格式错误";
			ngTipValidateConfig.uccBankCardMsg = "银行卡格式错误";
			ngTipValidateConfig.uccMinLengthMsg = "长度不能小于$";
			ngTipValidateConfig.uccMaxLengthMsg = "长度不能大于$";
			
		}]);
		

		
3.  每个验证表单都要填写`submit-btn-id`, 属性用于指定表单提交按钮的id， 在表单提交时执行验证函数。

		<input ... submit-btn-id="submit">
		
4.  在表单提交函数里，需要验证表单是否有错误，如果无错，方可提交：

		$scope.submit = function(){
			//提交前先验证表单是否正确
			if ($scope.myform.$valid){
				alert("do submit");	
			}
			else{
				alert('表单有错误');
			}
		};
		
5.  可以为每一个表单指定错误提示的方向，`ucc-tip-direction="1"` , 或者不指定，即使用默认值。 默认的提示方式可以如下配置：

		angular.module('ngTest',['ngTipValidate']).controller('ctrl',['$scope','ngTipValidateConfig',function($scope,ngTipValidateConfig){
			
			//错误提示的方向
			ngTipValidateConfig.tipDirection = 1; // 1, 2 , 3, 4 分别代表上、右、 下 、 左
		}]);
		
### 远程验证附加说明
1.  远程验证的url 必须跟网页路径是同源的，目前不支持跨域。填写方式如下：

		<input ucc-remote="/testCtrl/remoteTest" />
		

2.  远程验证的返回数据的格式必须满足如下格式：其中success代码验证是否成功， 而msg代码验证失败需要显示的错误提示。

		“{success:true, msg:xxx, data:xxx}” 		

	或者
		
		“{success:false, msg:'必须满足xx条件', data:xxx}”
		
3.  远程验证发起请求时，当前表单的值会以“value”的名称作为post数据 发送到后台。 后台（java）可以通过 `request.getParameter("value")` 获取表单数据。

4.  远程验证如果需要 附加验证条件， 可以通过如下代码指定 post data ， 而当前表单的值会附加到 post data 的 ’value‘ 属性上去。

		<input ... ucc-remote-data="remoteData" />
	
	在controller中定义要提交的数据：
	
		$scope.remoteData = {
			id : 1234,
			name : "wzggg"
		};
		
	最终提交的数据为
	
		{
			id : 1234,
			name : "wzggg",
			value : 表单当前值
		}
		


<script type="text/javascript">
	angular.module('ngTest',['ngTipValidate']).controller('ctrl',['$scope', 'ngTipValidateConfig',function($scope, ngTipValidateConfig){
		//修改ng-validate 的默认配置项
		ngTipValidateConfig.uccRequireMsg = "必须非空";
		
		
		$scope.name = "";
		$scope.email = "";
		$scope.phone = "";
		$scope.remoteData = {
			id : 1234,
			name : "wzggg"
		};
		$scope.validateFun = function(input){
			if ("wz" != input){
				return "必须是wz";
			}
			else{
				//验证成功返回0 或者 null 或者 false
				return 0;
			}
		}
		
		$scope.submit = function(){
			//提交前先验证表单是否正确
			if ($scope.myform.$valid){
				alert("do submit");	
			}
			else{
				alert('表单有错误');
			}
		};
	}]);
	
</script>


	


