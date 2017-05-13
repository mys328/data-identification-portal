(function(){
    var uniformContract = angular.module("uniformContract", ["uniformModule"]);
    uniformContract.factory("contractQueryService", ["$http", "contextServer", function ($http, contextServer) {

        function getContractPage(queryObj, callback, errorCallback) {
        	$http.jsonp(contextServer + "/ct/paas/us/commonresource/getBriefContract.do?callback=JSON_CALLBACK", {
                params: {
                    code: queryObj.code,            		 // 合同编码
                    name: queryObj.name,           			 // 合同名称
                    deptCode: queryObj.deptCode,       		 // 经办部门
                    agentCode: queryObj.agentCode,           // 经办人
                    signDateMin: queryObj.signDateMin,       // 签订开始日期
                    signDateMax: queryObj.signDateMax,       // 签订结束日期
                    partyId: queryObj.customerCode,	 		 // 客户编码		
                    payType: queryObj.payType,				 // 合同收支类型
                    pageSize: queryObj.pageSize,             // 页尺寸
                    currentPage: queryObj.currentPage        // 当前页号
                }
            }).success(function (result) {
                if (callback) {
                    callback(result);
                }
            }).error(errorCallback);
        };
        
        //获取业务字典键值对
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
        };

        return {
            getContractPage: function (queryObj, callback, errorCallback) {
                getContractPage(queryObj, callback, errorCallback);
            },
            getBizDictMapNodes: function (params, callback, errorCallback) {
            	getBizDictMapNodes(params, callback, errorCallback);
            }
        };
    }]);

    uniformContract.directive("searchContractQueryDialog", ["contextServer", function (contextServer) {

        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/search.contract.jsp",
            scope: {
                showDialog: "=",
                modalTitle: "@",
                customerCode: "=",
                payType: "=",			//合同收支类型（收入/支出--SAL/PUR） 不传则查全部
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
            controller: ["$scope", "contractService", "uniformService", function ($scope, contractService, uniformService) {

                //查询条件
                var loadListQueryView = {
                	code: "",       		// 合同编码
                	name: "",       		// 合同名称
                	deptCode: "",       	//经办部门
                	agentCode: "",      	//经办人
                    signDateMin: "",        //签订开始日期
                    signDateMax: "",        //签订结束日期
                    customerCode: "",		//客户编码
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
                	$scope.loadListQueryView.customerCode = $scope.customerCode;
                	$scope.loadListQueryView.payType = $scope.payType;
                    $scope.switchPage();
                };

                /**
                 * 当选择合同对话框关闭时， 清除UI数据
                 */
                $scope.onClose = function () {
                    //清空查询条件
                    $scope.loadListQueryView = {
                        	code: "",       		// 合同编码
                        	name: "",       		// 合同名称
                        	deptCode: "",       	//经办部门
                        	agentCode: "",      	//经办人
                            signDateMin: "",        //签订开始日期
                            signDateMax: "",        //签订结束日期
                            customerCode: "",		//客户编码
                            pageSize:5,             //当前页大小
                            currentPage:1           //当前页
                        };
                };
                
                //获取业务字典键值对
                contractService.getBizDictMapNodes('CM_CONTRACT_DETAIL_TYPE', function (data) {
                    $scope.bizDictMapNodes = data;
                }, function (error) {
                    $scope.showMask = false;
                });

                /**
                 * 查询选择合同
                 */
                $scope.searchContracts = function () {
                    $scope.showMask = true;
                    contractService.getContractPage($scope.loadListQueryView, function (contractPage) {
                        $scope.contractView = contractPage;
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
                    $scope.searchContracts();
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
                                contractItem: $scope.selectedItem
                            });
                        }
                    }
                };
            }]
        };
    }]);
    
})();