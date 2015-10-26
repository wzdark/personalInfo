var combobox = angular.module('combobox',[]);

//定义combobox测试用的数据源 模拟远端数据 (定义一个服务)
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

//定义combobox控件的控制器 (定义一个服务)
combobox.factory('comboboxController',['comboboxDataSource', function(comboboxDataSource){
	ComboboxController.$inject = ['$scope', '$http',  '$rootScope','$q' ];
	function ComboboxController($scope, $http, $rootScope, $q) {
		//待选项初始为空
		$scope.dataList = [];
		$scope.selectedItem = null;
		$scope.isShowList = false;
		$scope.isLoading = false;
		
		//向数据库发起请求加载数据
		function getData(){
			//模拟远端数据
			if ($scope.dataServer == "comboboxDataSource"){
				return comboboxDataSource.getData();	
			}
			//通过url 获取远端数据
			else{
				console.info("get: " + $scope.dataUrl);
			}
			
		};
		
		//点击弹出下拉框事件
		$scope.dropDown = function(){
			if ($scope.isShowList){
				$scope.isShowList = false;
				return;
			}
			// 如果数据为0  则向后台发起请求 加载数据
			if ($scope.dataList.length == 0 ){
				$scope.isLoading = true;
				getData().then(function(list){
					$scope.dataList = list;
					$scope.isLoading = false;
					$scope.isShowList = true;
				},function(error){
					$scope.isLoading = false;
				});
			}
			else{
				$scope.isShowList = true;
			}
		}
		
		$scope.selectItem = function(item){
			$scope.selectedItem = item;
			$scope.isShowList = false;
			//通知上层控制器 选择改变
			$scope.$emit('comboBoxSelectChanged',item);
		}
		
	}
	return ComboboxController;
}]);

//定义combobox控件的视图 (定义一个服务)
combobox.factory('comboboxView',function(){
	// html code
	var comboboxView = 
		'<span class="opa-combobox" > ' +
			'<span class="opa-combobox-wrap" ng-click="dropDown()">' +
				'<input ng-disabled="true" ng-model="selectedItem.name" class="opa-combobox-input" placeholder="" > ' +
				'<span class="opa-combobox-icon-wrap" >' +
					'<i  class="loading absolute-center opa-combobox-icon" ng-show="isLoading" >loading</i>' +
					'<i  class="select absolute-center opa-combobox-icon" ng-show="!isLoading">select</i>' +
				'</span>' +
			'</span>' +
			'<div class="opa-combobox-list-container">' +
				'<ul class="opa-combobox-list " ng-class="{opaHide: !isShowList ,opaShow : isShowList }" >' +
					'<li ng-repeat="item in dataList" ng-click="selectItem(item)" class="opa-combobox-item" ng-class="{opaSelected: selectedItem == item}">{{item.name}}</li>' +
				'</ul>' +
			'</div>' +
		'</span>';
		
	return comboboxView;
});


combobox.directive('combobox',["comboboxController","comboboxView",function( comboboxController,comboboxView ){
	return {
      restrict: 'E',
      scope: true,
      controller: comboboxController,
      template: comboboxView,
      link: function(scope, elem, attrs, ctrl) {
      	scope.dataUrl = attrs.url;
      	scope.dataServer = attrs.server; 
        //监听下拉框失去焦点事件， 目前用jquery的方案，  以后用angular事件代替
        
		//层内的link点击事件，注意让事件停止冒泡
		$(".opa-combobox").click(function(event){
			event=event || window.event;
			event.stopPropagation();
		});
		
		//点击层外，隐藏这个层。由于层内的事件停止了冒泡，所以不会触发这个事件
		$(document).click(function(e){					   
        	scope.$apply(function(){
        		scope.isShowList = false;
        	});
		});

      }
    };
}]);






