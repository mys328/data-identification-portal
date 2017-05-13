
(function () {
    
    var commonExpoerPage = angular.module("commonExpoerPage",["uniformModule"]);
    
    
    commonExpoerPage.factory("exportPageService", ["$http", "contextServer", function ($http, contextServer) {
        
    	//查询导出进度
        function getExpoetProgress(params, callback, errorCallback) {
        	$http.jsonp(contextServer + "/ct/paas/ct/unExportPage/progress.do?callback=JSON_CALLBACK", {
                params: {
                	sourceType: params           		 // 合同编码
                }
            }).success(function (result) {
                if (callback) {
                    callback(result);
                }
            }).error(errorCallback);
        };


        return {
        	getExpoetProgress: function (params, callback, errorCallback) {
        		getExpoetProgress(params, callback, errorCallback);
            }
        };
    }]);

    commonExpoerPage.directive("exportPageDialog", ["contextServer","exportPageService", function (contextServer,exportPageService) {
        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/export.page.jsp",
            scope: {
                showDialog: "=",
                reportPage: "=",
                modalTitle: "@",
                confirmButton: "@",
                pageDownload: "&"
            },
            controller: ["$scope", function ($scope) {
            	
            	var view = {
            		showExportMask:false,
            		currentPage :""
                };
                    
                $scope.view = view;

                $scope.onShow = function () {
                    $scope.$apply(function () {
                        if ($scope.reportPage) {
                            view.reportPage = $scope.reportPage;
                        } else {
                        	view.reportPage ={};
                        	view.reportPage.itemList =[];
                        }
                    });
                };
                
                var iCount;
                
                $scope.down = function (item) {
                	$scope.pageDownload({
                		currentPage:item.currentPage,
                    	pageSize:view.reportPage.pageSize
                	});
                    
                	view.showExportMask = true; 
                	item.exportFlag = 2; //设置当前批次为导出中
                	//设置导出的当前页数
                	view.currentPage = item.currentPage;
                	iCount = setInterval(ajaxProgress, 6000);
                };

                $scope.onClose = function () {
//                        $scope.$apply(function () {
//                            resetValues();
//                        });
                };
                
                $scope.closeInterval = function () {
                	clearInterval(iCount);
                	view.showExportMask = false;
                };
                
                function ajaxProgress(){
                	exportPageService.getExpoetProgress($scope.reportPage.sourceType, function (data) {        
          				 $("#shadeKey").val(data);
        		         if(data == "false" || data == false){
        		        	 clearInterval(iCount);
        		        	 $scope.view.showExportMask = false;
        		        	 
        		        	 angular.forEach(view.reportPage.itemList,function(item){
        							if(view.currentPage == item.currentPage){
        								//设置导出完成
        								item.exportFlag = 1; //导出完成
        							}
        						})
        		        	 
        		         }
          			}, function (error) {
          				clearInterval(iCount);
                   		$scope.view.showExportMask = false;
          			});
                }
            }]
        };
    }]);
    
    
    
})();