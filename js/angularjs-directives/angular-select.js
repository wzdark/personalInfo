
/*
 angular-exselector v1.0
 author: zhanglei、wangzhuo
 require: jquery,angularjs,select2.js
*/
(function () {
	
	//辅助函数
	function isNull(obj) {

		if (obj instanceof Object) {
			return jQuery.isEmptyObject(obj);
		} else if (obj instanceof String) {
			return obj.toUpperCase() == 'NULL' || obj.toUpperCase() == 'UNDEFINED'
					|| obj == '{}'
		}
		return obj == null || obj == undefined;
	}
	
	
	
    angular.module('angularSelect', [])
	

	//定义控件的控制器 
	.factory('selectController', function () {
	    controller.$inject = ['$scope', '$http', '$rootScope', '$q', '$timeout', '$attrs','$parse'];
	    function controller($scope, $http, $rootScope, $q, $timeout, $attrs, $parse) {
	        
	        $timeout(function () {
	            //如果绑定了数据源，则监视父scope的数据变化
	            if ($attrs.ngDataSource) {
	                $scope.$parent.$watch($attrs.ngDataSource, dataSourceChange);
	            }
	        });
	        
	        
	        //数据源变化
	        function dataSourceChange() {
	        	var func = 	$parse($attrs.ngDataSource);
	        	
	            var newDataSource = func($scope.$parent);
	        
	            if (newDataSource instanceof Array) {
	                $scope.dataSource = newDataSource;
	                return;
	            }
	            var dataSource = [];
	            for (var item in newDataSource) {
	                    dataSource.push(newDataSource[item])
	                }
	         
	            $scope.dataSource = dataSource;
	        }
	    }
	    return controller;
	})
	

	//定义控件的视图 (定义一个服务)
	.factory('selectView', function () {
	    // html code
	    var view =
			'<select  style="min-width:80px"   >' +
            '</select>';

	    return view;
	})

	.directive('angularSelect', ["selectController", "selectView", "$timeout", "$parse", 
	function (selectController, selectView, $timeout, $parse) {
	    return {
	        restrict: 'E',
	        scope: {
	            select: '&'   //将select函数绑定到父作用域
	        },
	        require: 'ngModel',
	        controller: selectController,
	        template: selectView,
	        compile: function (tElem, tAttrs, transclude) {
	            //这个时候template还没有渲染到视图里，可以修改模板内容
	            var modelPath = "$parent." + tAttrs.ngModel;
	           
	            //将select的数据和数据源直接绑定到父scope对象里
	            var selectE = $(tElem).find("select");
	            selectE.attr("ng-model", modelPath);
	            var name = tAttrs["ngOptionsName"] || "name";
	            selectE.attr("ng-options", "a." + name + " for a in dataSource");
	            if (tAttrs.multiple=="true") {
	            	selectE.attr("multiple", tAttrs.multiple);
	            }
	            if (tAttrs.disabled==="true") {
	                selectE.attr("disabled", "disabled");
	            }
	            if (tAttrs.placeholder) {
	                selectE.attr("data-placeholder", tAttrs.placeholder);
	            }
	            return {
	                pre: function preLink(scope, iElem, iAttrs, ctrl) { },
	                post: postLink
	            }
	        }
	    };

	    function postLink(scope, elem, attrs, ngModel) {
	        var ischange = false;
	        var value = attrs["ngOptionsValue"] || "value";
	        var getFunc = $parse(attrs.ngModel);
	        var setFunc = $parse(attrs.ngModel + " = data");
	        
	        
	        var cSelect = function () {
	            ischange = true;
	            var targetItem;
	            //如果是单选，则选择model 改为 vaklue的形式:  {value:123,name,xxx} = > 123
	            if ((isNull(attrs.multiple) || attrs.multiple.toUpperCase() == "FALSE") && attrs["ngModelType"] != "json") {
	                var selectItem = getFunc(scope.$parent); 
	                targetItem = selectItem ?  selectItem[value] : null;
	                scope.$apply(function(){
	                	setFunc(scope.$parent, {data: targetItem});	
	                });
	                
	            }
	            else{
	            	var selectItems = getFunc(scope.$parent); 
	            	targetItem = selectItems;
	            	
	            }
	            if (scope.select) {
	            	scope.$apply(function(){
	            		scope.select({value:targetItem});
	            	});
	                
	            }
	            
	            //验证非空
	            if (attrs.require != undefined ){
	            	validateMethod();
	            }
	            
	        };
			
			
	        //初始化bootstrap select控件
	        var selectEle = $(elem).find("select");
	        selectEle.change(function(){
	        	cSelect();
	        });
	       
	        setTimeout(function () {
	            selectEle.select2({});  
	            
	        });
	      
        	
	        //数据模型变化的刷新  bootstrap select控件
	        ngModel.$render = function () {
	            $timeout(function () {
	                if (ischange) {
	                    ischange = false;
	                    return;
	                }
	                var select = getFunc(scope.$parent); 
	                if (isNull(select)) {
	                	selectEle.select2({})
	                }
	                else{
	                    selectEle.val(select);
	                    selectEle.select2("val", getIndex(select));
	                }
	                //验证非空
		            if (attrs.require != undefined ){
		            	validateMethod();
		            }
	            });
	        };

            //设置选中的项
	        function getIndex(data) {
	            var source = scope.dataSource || [];
	            if (isNull(attrs.multiple) || attrs.multiple.toUpperCase() == "FALSE") {
	                if (data instanceof Object) {
	                    data = data[value];
	                }

	                for (var i = 0; i < source.length ; i++) {
	                    if (source[i][value] === data) {
	                        return i;
	                    }
	                }
	            }
	            if (data) {
	                var ret = [];
	                ///如果绑定的数据是{value:"",name:""}
	                ///数据是{"a":{value:"a","name":"aaa"},"b":{value:"b","name":"bbb"}}或者数组[{value:"a","name":"aaa"},{value:"b","name":"bbb"}]
	                for (var e in data) {
	                    var item = data[e];
	                    for (var i = 0; i < source.length ; i++) {
	                        if (source[i][value] === item[value]) {
	                            ret.push(i);
	                            continue;
	                        }
	                    }
	                }
	                return ret;
	            }

	            return [];
	           
	        }
	        
	        //判断是否有require属性，如果是 则必须有submitBtnId
            var submitBtn;
            var errMsg = "";
            var tipDirection = 1;
            if (attrs.require != undefined ){
            	errMsg = attrs.require ? attrs.require : "必填项";
            	if (!attrs.submitBtnId){
		      	 	throw new Error(directiveName + ' must has "submit-btn-id" attribute!!' );
		      	}
		      	submitBtn = $("#" + attrs['submitBtnId']);
		      	if (submitBtn.length ==0){
		      		throw new Error('do not find submitBtn which id is "' + attrs['submitBtnId'] +'"!' );
		      	}
		      	submitBtn.click(function(){
		      		validateMethod();
		      	});
		      	if (attrs.tipDirection){
		      		tipDirection = attrs.tipDirection;
		      	}
            }
	        
	        //当表单提交时验证函数
	        var tipId;
	        function validateMethod(){
	        	var selectItem = getFunc(scope.$parent);
	        	if (!selectItem || selectItem.length == 0){
	      	 		ngModel.$setValidity('require', false);
	      	 		//先把之前的错误提示关闭
                	if (tipId){
                		layer.close(tipId); tipId = null;
                	}
                	//
                	var selectDiv = $(elem).find(".select2-container");
	            	var selectDivId = selectDiv.attr("id");
	      	 		tipId = layer.tips(errMsg, '#' + selectDivId ,  {
					    tipsMore: true, time:5000 , tips: tipDirection 
					});
	      	 	}
	      	 	else{
	      	 		ngModel.$setValidity('require', true);
	      	 		layer.close(tipId); tipId = null;
	      	 	}
	        }
	    }
	}])
}());