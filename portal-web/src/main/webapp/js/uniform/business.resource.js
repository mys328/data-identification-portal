(function () {
    var uniformBusiness = angular.module("uniformBusiness", ["uniformModule"]);
    uniformBusiness.factory("businessService", ["$http", "contextServer", function ($http, contextServer) {

        function getBusinessPage(loadListQueryView, callBack, errorCallback) {
            $http.jsonp(contextServer+"/ct/paas/us/commonresource/getCommonBusiness.do?callback=JSON_CALLBACK",  {
            	params: {
	                businessCode: loadListQueryView.attrs.businessCode,           	// 商机编码
	                businessName: loadListQueryView.attrs.businessName,       	// 商机名称
	                customerId: loadListQueryView.attrs.customerId,      	 	// 客户编码
	                status:"4",
	                pageSize: loadListQueryView.pageSize,             			// 页尺寸
	                currentPage: loadListQueryView.currentPage  				// 当前页号
            	}
            })
                .success(function (result) {
                    if (callBack) {
                        callBack(result);
                    }
                })
                .error(errorCallback);
        }

        return {
            getBusinessPage: function (queryBean, callBack, errorCallback) {
                getBusinessPage(queryBean, callBack, errorCallback);
            }
        };
    }]);

    uniformBusiness.directive("searchBusinessDialog", ["contextServer", function (contextServer) {

        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/search.business.jsp",
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
            controller: ["$scope", "businessService", "uniformService", function ($scope, businessService, uniformService) {

                //查询条件
                var loadListQueryView = {
                		attrs:{
                			businessCode: "",           // 商机编码
                            businessName: "",       	// 商机名称
                            customerId: "",      	    // 客户编号
                            customerName: ""            // 客户名称
                		},
                    
	                	pageSize:5,            	 	//当前页大小
	                    currentPage:1           	//当前页
                    	
                };

                $scope.loadListQueryView = loadListQueryView;
                
                $scope.businessData = {};
                //隐藏遮罩 false为关闭
                $scope.showMask = false;
                
                /**
                 * 选择客户弹框
                 */
                $scope.view ={
                		showCustomerSearchDialog : false
                }
                /**
                 * 选择客户回调
                 */
                $scope.selectCustomer = function(customer){
                	$scope.loadListQueryView.attrs.customerId = customer.mdmcode;
                	$scope.loadListQueryView.attrs.customerName = customer.fullname;
                };

                /**
                 * 当查询框显示的时候， 开始查询选择商机
                 */
                $scope.onShow = function () {
                    $scope.switchPage(1, $scope.loadListQueryView.pageSize);
                };

                /**
                 * 当选择商机对话框关闭时， 清除UI数据
                 */
                $scope.onClose = function () {
                    //清空查询条件
                	loadListQueryView.attrs = {
                    		
                    			businessCode: "",       		
                    			businessName: "",       	
                                customerId: "",
                                customerName:""
                    };
                };

                /**
                 * 查询选择商机
                 */
                $scope.searchBusiness = function (currentPage, pageSize) {
                    $scope.showMask = true;
                    businessService.getBusinessPage($scope.loadListQueryView,function(data){
                    	console.log("请求返回数据:",data);
                        $scope.businessData = data;
                        $scope.showMask = false;

                    },function(errorData){
                        console.log("errorData:",errorData);
                        $scope.showMask = false;
                    });
                };
                $scope.switchPage = function (currentPage, pageSize) {
                	loadListQueryView.pageSize = pageSize;
                	loadListQueryView.currentPage = currentPage;
                    $scope.searchBusiness();
                }	
                /**
                 * 跟踪选择商机
                 * @param item 合同当前行
                 */
                $scope.selectItem = function (item) {
                    $scope.selectedItem = item;
                };

                /**
                 * 选择商机选择回调
                 */
                $scope.onSelected = function () {
                    if ($scope.onSelectedConfirm) {
                        if ($scope.selectedItem) {
                            $scope.onSelectedConfirm({
                                business: $scope.selectedItem
                            });
                        }
                    }
                };
            }]
        };
    }]);

})();