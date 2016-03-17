/*
 angular-calendar v0.1
 author: wangzhuo   
 email: wzfindjob@163.com
 require: jquery,angularjs
*/
(function(){
	//整个模块
	angular.module('ngText',[])
	
	//控制器
	.factory('textController',function(){
		controller.$inject = ['$scope', '$q' ,'$timeout','ModelValidateService','$parse','$attrs'];
		function controller($scope, $q, $timeout, ModelValidateService, $parse,$attrs) {
			
			//如果绑定了数据，则监视model 变化函数
			$scope.modelChange = function(){
				//手动修改的 不处理
				if (isManualChange){
					isManualChange = false;
					return;
				}
				
				//验证数字
				if (!ModelValidateService.validate($scope.ngModel.$modelValue, $attrs.modelType)){
					$scope.ngModel.$modelValue = "";
					$timeout(function(){
						showErr("只能输入数字");
					});
				}
	            else{
	            	closeErr();
	            }
				
				$scope.inputValue = $scope.ngModel.$modelValue;
				//验证非空
	            if ($attrs.require != undefined ){
	            	$timeout(function(){
	            		validateRequireMethod();	
	            	})
	            	
	            }
	            
			}
			
			
			var blurFunc;
			if ($attrs.blur){
				blurFunc = $parse($attrs.blur);
			}
			$scope.inputValue = "";
			//离开焦点事件
			$scope.blur = function(){
				$scope.closeEdit();
				if ($attrs.blur){
					blurFunc($scope.$parent,{value: $scope.inputValue});
				}
				//验证非空
	            if ($attrs.require != undefined ){
	            	validateRequireMethod();
	            }
			}
			
			//input值改变事件
			if ($attrs.modelType == "number"){
				$scope.$watch('inputValue', function(newValue, oldValue) {
					//非法验证, 如果验证失败，值回滚为上一次的值
					if (!ModelValidateService.validate(newValue, $attrs.modelType)){
						$scope.inputValue = oldValue;
						showErr("只能输入数字");
					}
				});
			}
			
			
			/*只读状态 和 可编辑状态切换*/
			$scope.isEditing = false;
			$scope.edit = function(){
				
				$scope.isEditing = true;
				$timeout(function(){
					$scope.inputElement.focus();	
				});
			};
			var setFunc = $parse($attrs.ngModel + " = data");
			var isManualChange = false;
			$scope.closeEdit = function(){
				setFunc($scope.$parent, {data : $scope.inputValue})
				isManualChange = true;
				$scope.isEditing = false;
			}
			
			
			
			//去下一个input函数
			$scope.moveNextInput = function(){
				setTimeout(function(){
					var thisEle = $scope.inputElement;
					//找到form表单所在
					var inputs = thisEle.closest('form').find(':input');
	  				inputs.eq( inputs.index(thisEle)+ 1 ).focus();
				});
			};
			
			//判断是否有require属性，如果是 则进行非空验证
            var submitBtn;
            var errMsg = "";
            var tipDirection = 1;
            if ($attrs.require != undefined ){
				errMsg = $attrs.require ? $attrs.require : "必填项";
            	if ($attrs.submitBtnId){
		      	 	submitBtn = $("#" + $attrs['submitBtnId']);
		      	 	//表单提交时验证
		      	 	submitBtn.click(function(){
			      		validateRequireMethod();
			      	});
		      	}
		      	
		      	if ($attrs.tipDirection){
		      		tipDirection = $attrs.tipDirection;
		      	}
	      	}
            
			//验证函数
	        
	        function validateRequireMethod(){
	        	var value = $scope.ngModel.$modelValue;
	        	if (!value || value.trim() == ""){
	      	 		$scope.ngModel.$setValidity('require', false);
	      	 		showErr(errMsg);
	      	 	}
	      	 	else{
	      	 		$scope.ngModel.$setValidity('require', true);
	      	 		closeErr();
	      	 	}
	        }
	        
	        var tipId;
	        function showErr(msg){
	        	//先把之前的错误提示关闭
            	if (tipId){
            		layer.close(tipId); tipId = null;
            	}
            	
      	 		tipId = layer.tips(msg, '#' + $scope.spanWrapperId ,  {
				    tipsMore: true, time:5000 , tips: tipDirection 
				});
	        }
			
			function closeErr(){
				layer.close(tipId); tipId = null;
			}
		}
		return controller;
	})
	
	//定义控件的视图 (定义一个服务)
	.factory('textView',function(){
		// html code
		var view = 
			'<span class="ng-text-wrapper" >' + 
				'<input  ng-show="isEditing " ng-model="inputValue" ng-blur="blur();" type="text" >' + 
				'<span ng-show="!isEditing " ng-click="edit();" class="ng-text-readonly-span">{{inputValue | nullFilter}}</span>' +
			'</span>';
		return view;
	})
	
	//指令
	.directive('ngText',["textController","textView","$timeout","$rootScope",function( textController, textView ,$timeout,$rootScope){
		return {
	      restrict: 'E',
	      require:  'ngModel',
	      scope: true,     //指令新的scope，通过.$parent访问父的scope
	      controller: textController,
	      template: textView,
	      link: function(scope, elem, attrs, ngModel) {
	      	
	      	//获取里面的input元素
	      	scope.inputElement = $(elem).find("input[type=text]");
	      	
	      	//获取wrapper 盒子 id 用于错误提示tip
	      	var spanWrapper = $(elem).find(".ng-text-wrapper");
	      	var spanWrapperId =  spanWrapper.attr("id");
	      	if (!spanWrapperId){
	      		spanWrapperId = Math.random().toString(36).substr(10);
		      	spanWrapper.attr("id",spanWrapperId);
	      	}
	      	scope.spanWrapperId = spanWrapperId;
	      	
	      	var eWidth = attrs.eWidth;
	      	//设置input元素的宽度
	      	if (eWidth){
	      		scope.inputElement.css("width",eWidth);	
	      	}
	      	
	      	
	      	//获取绑定model的名称
	      	scope.ngModel = ngModel;
	      	scope.ngModel.$render = function(){
	      		
	      		scope.modelChange();
	      	};
	      	
	      }
	    };
	}])
	
	.filter("nullFilter" , function(){
		return function(input, nullValue){
			if (!nullValue){
				nullValue = "空";
			}
			if (input == null || input == undefined || input == ""){
				return nullValue;
			}
			return input;
		};
	})
	
	.service("ModelValidateService", function(){
		this.validate = function(input, type){
			var res = input;
			if (type == "number"){
				var tmp = input - 1;
				if (!isNaN(tmp) ){
					return true
				}
				else{
					return false;
				}
				
			}
			return true;
		}
	})
	
	
	
})();
