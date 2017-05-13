(function(){
    var uniformTaxcode = angular.module("uniformTaxcode", ["uniformModule"]);
    uniformTaxcode.factory("taxcodeService", ["$http", "contextServer", function ($http, contextServer) {

        function getTaxcodePage(queryObj, callback, errorCallback) {
        	$http.jsonp(contextServer + "/ct/paas/ct/resource/getTaxInfo.do?callback=JSON_CALLBACK", {
                params: {
                    id: queryObj.id,            				// 税码
                    taxRate: queryObj.taxRate,            		// 税率
                    taxType: queryObj.taxType,           		// 税类型
                    isDeduction: queryObj.isDeduction,       	// 是否可抵扣
                    taxTypeInclude: queryObj.taxTypeInclude, 	//税类型的过滤条件
                    pageSize: queryObj.pageSize,                // 页尺寸
                    currentPage: queryObj.currentPage           // 当前页号
                }
            }).success(function (result) {
                if (callback) {
                    callback(result);
                }
            }).error(errorCallback);
        };

        function getTaxType(taxType, callback, errorCallback) {
            $http.jsonp(contextServer + "/ct/paas/ct/resource/getTaxTypeInfo.do?callback=JSON_CALLBACK", {
                params: {
                	taxType: taxType           // 税类型的过滤条件
                }
            }).success(function (result) {
                if (callback) {
                    callback(result);
                }
            }).error(errorCallback);
        };

        return {
            getTaxcodePage: function (queryObj, callback, errorCallback) {
                getTaxcodePage(queryObj, callback, errorCallback);
            },
            getTaxType: function (taxType, callback, errorCallback) {
                getTaxType(taxType, callback, errorCallback);
            }
        };
    }]);

    uniformTaxcode.directive("searchTaxcodeDialog", ["contextServer", function (contextServer) {

        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/search.taxcode.jsp",
            scope: {
                showDialog: "=",
                modalTitle: "@",
                dialogId: "@",
                taxType: "=",
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
            controller: ["$scope", "taxcodeService", "uniformService", function ($scope, taxcodeService, uniformService) {

                //查询条件
                var loadListQueryView = {
                    id: "",       			// 税码
                    taxRate: "",			//税率
                    taxType: "",        	// 税类型
                    isDeduction: "",       	// 是否可抵扣
                    taxTypeInclude: "",    	//税类型的过滤条件
                    pageSize:5,     		//当前页大小
                    currentPage:1  			//当前页
                };

                $scope.loadListQueryView = loadListQueryView;
                //隐藏遮罩 false为关闭
                $scope.showMask = false;

                /**
                 * 当查询框显示的时候， 开始查询选择税码
                 */
                $scope.onShow = function () {
                	//税类型
                    taxcodeService.getTaxType($scope.taxType,function (data) {
                        $scope.taxTypeList = data;
                    }, function (error) {
                    });
                    
                    $scope.loadListQueryView.taxTypeInclude = $scope.taxType;
                    $scope.switchPage();
                };

                /**
                 * 当选择税码对话框关闭时， 清除UI数据
                 */
                $scope.onClose = function () {
                    //清空查询条件
                    $scope.loadListQueryView = {
                        id: "",       		// 税码
                        taxRate: "",		//税率
                        taxType: "",        // 税类型
                        isDeduction: "",    // 是否可抵扣
                    };
                };

                /**
                 * 查询选择税码
                 */
                $scope.searchTaxcodes = function () {
                    $scope.showMask = true;
                    taxcodeService.getTaxcodePage($scope.loadListQueryView, function (taxcodePage) {
                        $scope.taxcodeView = taxcodePage;
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
                    $scope.searchTaxcodes();
                }

                /**
                 * 跟踪选择税码
                 * @param item 税码当前行
                 */
                $scope.selectItem = function (item) {
                    $scope.selectedItem = item;
                };

                /**
                 * 选择税码选择回调
                 */
                $scope.onSelected = function () {
                    if ($scope.onSelectedConfirm) {
                        if ($scope.selectedItem) {
                            $scope.onSelectedConfirm({
                                taxcodeItem: $scope.selectedItem
                            });
                        }
                    }
                };
            }]
        };
    }]);
    
})();