(function(){
    var uniformBusinessType = angular.module("uniformBusinessType", ["uniformModule"]);
    uniformBusinessType.factory("businessTypeService", ["$http", "contextServer", function ($http, contextServer) {

        function getBusinessTypePage(queryObj, callback, errorCallback) {
        	$http.jsonp(contextServer + "/ct/paas/ct/resource/getBusinessTypeInfo.do?callback=JSON_CALLBACK", {
                params: {
                	typeCode: queryObj.typeCode,            		   // 合同编码
                	typeName: queryObj.typeName,           			  // 合同名称
                    pageSize: queryObj.pageSize,                  // 页尺寸
                    currentPage: queryObj.currentPage            // 当前页号
                }
            }).success(function (result) {
                if (callback) {
                    callback(result);
                }
            }).error(errorCallback);
        };
        
      /*  //获取业务字典键值对
        function getBizDictMapNodes(params, callback, errorCallback) {
        	$http.jsonp(contextServer + "/ct/paas/ct/resource/getBizDictMapNodes.do?callback=JSON_CALLBACK", {
                params: {
                	nodeKey: params           		 // 合同编码
                }
            }).success(function (result) {
                if (callback) {
                    callback(result);
                }
            }).error(errorCallback);
        };*/

        return {
        	getBusinessTypePage: function (queryObj, callback, errorCallback) {
        		getBusinessTypePage(queryObj, callback, errorCallback);
            },
          /*  getBizDictMapNodes: function (params, callback, errorCallback) {
            	getBizDictMapNodes(params, callback, errorCallback);
            }*/
        };
    }]);

    uniformBusinessType.directive("businessTypeDialog", ["contextServer", function (contextServer) {

        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/search.businessType.jsp",
            scope: {
                showDialog: "=",
                modalTitle: "@",
                confirmButton: "@",
                onSelectedConfirm: "&"
            },
            compile: function (element, attrs) {
                return function (scope, element, attrs) {
                    scope.dbSelected = function (node) {
                        if (scope.onSelected) {
                            scope.onSelected();
                        }
                        angular.element(element.children("div")[0]).modal("hide");
                    };
                }
            },
            controller: ["$scope", "businessTypeService", "uniformService", function ($scope, businessTypeService, uniformService) {

                //查询条件
                var loadListQueryView = {
                	typeCode: "",       		// 合同编码
                	typeName: "",       		// 合同名称
                    pageSize:5,             //当前页大小
                    currentPage:1           //当前页
                };

                $scope.loadListQueryView = loadListQueryView;
                //隐藏遮罩 false为关闭
                $scope.showMask = false;

                /**
                 * 当查询框显示的时候， 开始查询选择合同
                 */
                $scope.onShow = function () {
                    $scope.switchPage();
                };

                /**
                 * 当选择合同对话框关闭时， 清除UI数据
                 */
                $scope.onClose = function () {
                    //清空查询条件
                    $scope.loadListQueryView = {
                        	typeCode: "",       		// 合同编码
                        	typeName: "",       		// 合同名称
                            pageSize:5,             //当前页大小
                            currentPage:1           //当前页
                        };
                };
                
              /*  //获取业务字典键值对
                businessTypeService.getBizDictMapNodes('CM_CONTRACT_DETAIL_TYPE', function (data) {
                    $scope.bizDictMapNodes = data;
                }, function (error) {
                    $scope.showMask = false;
                });*/

                /**
                 * 查询选择合同
                 */
                $scope.searchBusinessType = function () {
                    $scope.showMask = true;
                    businessTypeService.getBusinessTypePage($scope.loadListQueryView, function (data) {
                        $scope.businessTypeView = data;
                        console.log($scope.businessTypeView);
                        $scope.showMask = false;
                    }, function (error) {
                        $scope.showMask = false;
                    });
                };

                /**
                 * 翻页查询
                 * @param currentPage
                 * @param pageSize
                 */
                $scope.switchPage = function (currentPage, pageSize) {
                    if(!currentPage){
                        $scope.loadListQueryView.currentPage = 1;
                    }else {
                        $scope.loadListQueryView.currentPage = currentPage;
                    }
                    if(!pageSize){
                        $scope.loadListQueryView.pageSize = 5;
                    }else {
                        $scope.loadListQueryView.pageSize = pageSize;
                    }
                    $scope.searchBusinessType();
                }

                /**
                 * 跟踪选择合同
                 * @param item 合同当前行
                 */
                $scope.selectItem = function (item) {
                    $scope.selectedItem = item;
                };

                /**
                 * 选择合同选择回调
                 */
                $scope.onSelected = function () {
                    if ($scope.onSelectedConfirm) {
                        if ($scope.selectedItem) {
                            $scope.onSelectedConfirm({
                            	businessTypeItem: $scope.selectedItem
                            });
                        }
                    }
                };
            }]
        };
    }]);
    
})();