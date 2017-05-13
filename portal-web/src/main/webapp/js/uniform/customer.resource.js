(function(){
    var uniformCustomer = angular.module("uniformCustomer", ["uniformModule"]);

    uniformCustomer.factory("customerService", ["$http", "contextServer", function ($http, contextServer) {
        /**
         * 客户查询
         * @param data  客户查询参数
         * @param callback   查询成功后的回调函数
         */
        function getCustomer(data, callback, errorCallback) {
            $http.jsonp(contextServer + "/ct/paas/us/commonresource/getCustomer.do?callback=JSON_CALLBACK", {
                params: {
                    mdmcode: data.customer.code,            // 客户编号
                    fullname: data.customer.name,           // 客户全称
                    customerType: data.customer.type,       // 供应商类型
                    sourcetype: data.customer.sourcetype,	//参数来源
                    pageSize: data.pageSize,                // 页尺寸
                    currentPage: data.currentPage,           // 当前页号
                    orderType:data.customer.orderType
                }
            }).success(function (customers) {    // 成功回调函数， customers为标准的pageBean格式json对象
                if (callback) {
                    callback(customers);
                }
            }).error(errorCallback);
        };

        /**
         * 查询客商相关的银行列表
         * @param mdmCode  客商编码
         * @param callback   查询成功后的回调函数
         */
        function getBankList(mdmCode, callback, errorCallback) {
            $http.jsonp(contextServer + "/ct/paas/us/commonresource/getBankList.do?callback=JSON_CALLBACK", {
                params: {
                    mdmcode: mdmCode	// 客商编码
                }
            }).success(function (data) {    // 成功回调函数，
                if (callback) {
                    callback(data);
                }
            }).error(errorCallback);
        };
        
        
        /**
         * 联系人查询
         * @param data    联系人查询参数
         * @param callback
         */
        function getContactPage(queryObj, callback, errorCallback) {
            $http.jsonp(contextServer + "/ct/paas/us/commonresource/getContactsInfo.do?callback=JSON_CALLBACK", {
                params: queryObj
            }).success(function (contacts) {          //  成功回调函数， contacts为标准的pageBean格式json对象
                if (callback) {
                    callback(contacts);
                }
            }).error(errorCallback);
        };

        /**
         * 添加联系人
         * @param contact    联系人对象
         * @param callback   成功后回调函数
         * @param errorCallback   错误时的回调函数
         */
        function addContact(contact, callback, errorCallback) {
            $http.jsonp(contextServer + "/ct/paas/us/commonresource/addContact.do?callback=JSON_CALLBACK", {
                params: contact
            }).success(function (result) {
                if (callback) {
                    callback(result);
                }
            })
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

        //获取供应商类型下拉框
        function getCustomerTypeList(params, callback, errorCallback) {
            $http.jsonp(contextServer + "/ct/paas/us/commonresource/getCustomerByType.do?callback=JSON_CALLBACK", {
                params: {
                    nodeKey: params           		 // 合同编码
                }
            }).success(function (result) {
                if (callback) {
                    callback(result);
                }
            }).error(errorCallback);
        };
        
        /*
         * 保存常用的cookie
         */
        function saveCommon(obj, cacheName){
            var _obj = {
            	abbreviation: obj.abbreviation,
            	accountgroup:obj.accountgroup,
            	address:obj.address,
            	area:obj.area,
            	customermark:obj.customermark,
            	fullname:obj.fullname,
            	industry:obj.industry,
            	mdmcode:obj.mdmcode,
            	postcode:obj.postcode,
            	suppliermark:obj.suppliermark,
            	detailcategory: obj.detailcategory,
            	tariff: obj.tariff,						// 税号
            	bankList: obj.bankList					// 关联银行信息
            };

            var list = JSON.parse($.cookie(cacheName));

            if(list == undefined || list == null){
                list = [];
            }

            var flag = false;
            angular.forEach(list,function(item,index){
                if(item.mdmcode == _obj.mdmcode){
                    flag = true;
                    return;
                }
            });

            if(!flag){
                if(list.length > 5){
                    list.unshift(_obj);
                    list.pop();
                }else {
                    list.unshift(_obj);
                }
                $.cookie(cacheName,JSON.stringify(list),{ expires: 365});
            }

        };

        return {
            getCustomer: function (queryObj, callback, errorCallback) {
                getCustomer(queryObj, callback, errorCallback);
            },
            getContactPage: function (queryObj, callback, errorCallback) {
                getContactPage(queryObj, callback, errorCallback);
            },
            addContact: function (contact, callback, errorCallback) {
                addContact(contact, callback, errorCallback);
            },
            getBizDictMapNodes: function (params, callback, errorCallback) {
            	getBizDictMapNodes(params, callback, errorCallback);
            },
            getCustomerTypeList: function (params, callback, errorCallback) {
                getCustomerTypeList(params, callback, errorCallback);
            },
            saveCommon: function (obj, cacheName) {
                saveCommon(obj, cacheName);
            },
            getBankList: function (mdmCode, callback, errorCallback) {
            	getBankList(mdmCode, callback, errorCallback);
            }
        };
    }]);

    uniformCustomer.directive("searchCustomerDialog", ["contextServer", function (contextServer) {

        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/search.customer.jsp",
            scope: {
                showDialog: "=",
                customerTypeFlag: "@", //只有在供应商的时候用到，当为empCustomer时查询条件为员工供应商和供应商，不传则默认值为供应商
                dialogId: "@",
                sourcetype: "@",
                modalTitle: "@",
                confirmButton: "@",
                onSelectedConfirm: "&",
                orderType:"="
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
            controller: ["$scope", "customerService", function ($scope, customerService) {
                var data = {
                    customer: {
                        code: "",       // 客户编号
                        name: "",       // 客户名称
                        sourcetype: $scope.sourcetype  // 数据来源source_customer为客商，source_supplier为供应商
                    },
                    pageSize: 5,       // 页尺寸
                    currentPage: 1      // 当前页号
                };

                var customerView = {
                    showMask: false,
                    totalPage: 0,           // 总页数
                    totalCount: 0,          // 总记录数
                    selectedCustomer: null,
                    customers: []           // 一页客户记录
                };
                
                $scope.data = data;
                $scope.customerView = customerView;
                
                $scope.csDialogView = {
                    all: false
                }
                //缓存视图
                $scope.csCache = {

                }
                
                $scope.onShow = function () {
                	customerView.selectedCustomer = null
                	if(!$scope.data.customer.sourcetype){
                		$scope.data.customer.sourcetype = 'source_supplier';
                	}
                	if($scope.data.customer.sourcetype == 'source_supplier'){
                		$scope.csCache.data = JSON.parse($.cookie('supplierList'));
                	}else if($scope.data.customer.sourcetype == 'source_customer') {
                		$scope.csCache.data = JSON.parse($.cookie('customerList'));
                	}
                	if(!$scope.csCache.data){
                        $scope.csCache.data = [];
                    }
                    /*if(!$scope.customerTypeFlag){
                        $scope.searchCustomer();
//                        $scope.customerTypeFlag = 'customer';
                    }else {
                        getCustomerType();
                    }*/
                    $scope.data.customer.type = 1;
                    if(!$scope.orderType){
                    	$scope.orderType="";
                    }
                    $scope.data.customer.orderType = $scope.orderType;
                    
                    $scope.searchCustomer();
                };

                $scope.onClose = function () {
//                    customerView.selectedCustomer = null
                    customerView.customers = [];
                    data.customer.code="";
                    data.customer.name="";
//                    data.customer.type="";
                };
                
                //获取业务字典键值对(账户组)
                customerService.getBizDictMapNodes('ACCOUNT_TYPE', function (data) {
                    $scope.bizDictMapNodes = data;
                }, function (error) {
                    $scope.showMask = false;
                });

                function getCustomerType(){
                    /*customerService.getCustomerTypeList($scope.customerTypeFlag, function (data) {
                        *//*data = [{itemKey:'1',itemName:'供应商'},
                                {itemKey:'2',itemName:'员工供应商'}];*//*
                        var list = [];
                        angular.forEach(data, function (key,value) {
                            var obj = {
                                itemKey: value,
                                itemName: key
                            }
                            list.push(obj);
                        });
                        $scope.customerTypeList = list;
                        *//*if($scope.customerTypeFlag == 'customer'){
                            $scope.data.customer.type = list[0].itemKey;
                        }*//*
                        if(!$scope.customerTypeFlag){
                            $scope.data.customer.type = list[0].itemKey;
                        }
                        if($scope.customerTypeFlag == 'empCustomer'){
                            $scope.data.customer.type = list[1].itemKey;
                        }
                        *//*if($scope.customerTypeFlag == 'all'){
                            $scope.data.customer.type = '';
                        }*//*
                        $scope.searchCustomer();
                    }, function (error) {
                        $scope.showMask = false;
                    });*/
                }

                /**
                 * 客户查询
                 */
                $scope.searchCustomer = function () {
                    customerView.showMask = true;
                    customerService.getCustomer($scope.data, function (customerPage) {
                        customerView.customers = customerPage.data;
                        customerView.totalCount = customerPage.totalCount;
                        customerView.totalPage = customerPage.totalPage;
                        customerView.selectedCustomer = null;
                        customerView.showMask = false;
                    }, function (error) {
                        customerView.showMask = false;
                    });
                };

                /**
                 * 翻页查询
                 * @param currentPage
                 * @param pageSize
                 */
                $scope.switchPage = function (currentPage, pageSize) {
                	if(!currentPage){
                        currentPage = 1;
                    }
                    if(!pageSize){
                        pageSize = 5;
                    }
                    data.pageSize = pageSize;
                    data.currentPage = currentPage;
                    $scope.searchCustomer();
                }
                
                /**
                 * 翻页查询--缓存
                 * @param currentPage
                 * @param pageSize
                 */
                $scope.switchPageByCache = function (currentPage, pageSize){
                    if(!currentPage){
                        currentPage = 1;
                    }
                    if(!pageSize){
                        pageSize = 5;
                    }
                    var pageData  = $scope.csCache.data.slice((currentPage-1)*pageSize,currentPage*pageSize);
                    $scope.csCache.pageSize = pageSize;
                    $scope.csCache.currentPageSize = pageData.length;
                    $scope.csCache.currentPage = currentPage;

                    $scope.csCache.totalCount = $scope.csCache.data.length;
                    $scope.csCache.totalPage = Math.ceil($scope.csCache.totalCount/$scope.csCache.pageSize);
                    $scope.members = pageData;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }

                /**
                 * 跟踪选择的客户
                 * @param customer
                 */
                $scope.selectCustomer = function (customer) {
                    customerView.selectedCustomer = customer;
                };

                /**
                 * 客户选择回调
                 */
                $scope.onSelected = function () {
                	customerView.showMask = true;
                	// 获取对应的相关银行信息列表
                	customerService.getBankList(customerView.selectedCustomer.mdmcode, function (data) {
                        customerView.selectedCustomer.bankList = data;
                        customerView.showMask = false;
                        
                        if($scope.data.customer.sourcetype == 'source_supplier'){
                    		customerService.saveCommon(customerView.selectedCustomer,'supplierList');
                    	}else if($scope.data.customer.sourcetype == 'source_customer') {
                    		customerService.saveCommon(customerView.selectedCustomer,'customerList');
                    	}
                        if ($scope.onSelectedConfirm) {
                            $scope.onSelectedConfirm({
                                customer: customerView.selectedCustomer
                            });
                        }
                    }, function (error) {
                        customerView.showMask = false;
                    });
                };
            }]
        }
    }]);

    uniformCustomer.directive("searchContactDialog", ["contextServer", function (contextServer) {

        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/search.contact.jsp",
            scope: {
            	bpCode:"=",
                showDialog: "=",
                modalTitle: "@",
                dialogId: "@",
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
            controller: ["$scope", "customerService", "uniformService", function ($scope, customerService, uniformService) {
            	
                var view = {
                    totalPage: 0,           // 总页数
                    totalCount: 0,          // 总记录数
                    pageSize: 5,           // 页尺寸
                    currentPage: 1,         // 当前页号
                    selectedItem: null,     // 跟踪当前选择的联系人
                    items: [],              // 一页草稿数据
                    importances :[],       // 联系人重要性
                    bpName: "",           // 客商名称
                    userName: "",           // 联系人姓名
                    importance: "",         // 联系人重要性
                    bpCode: "",         // 客商编码
                    showMask: false,        // 查询项目草稿遮罩提示层
                    switchPage: function (currentPage, pageSize) {
                        view.showMask = true;
                        customerService.getContactPage({
                            pageSize: pageSize,
                            currentPage: currentPage,
                            bpName: view.bpName,
                            userName: view.userName,
                            importance: view.importance,
                            bpCode: $scope.bpCode||view.bpCode
                        }, function (result) {
                        	console.log(view.items )
                            view.items = result.data || [];
                        	console.log(view.items )
                            view.totalPage = result.totalPage;
                            view.totalCount = result.totalCount;
                            view.showMask = false;
                        }, function (result) {
                            pms.warn(result);
                            view.showMask = false;
                        });
                    }
                };

                $scope.view = view;

                /**
                 * 当查询框显示的时候， 开始查询联系人
                 */
                $scope.onShow = function () {
                	// 获取联系人重要性数据字典
                    uniformService.getByNodeKey("PM_IMPORTANCETYPE", function (dicts) {        
            				view.importances = dicts;
            			}, function (error) {
            				alert(error);
            			});
                    $scope.searchContacts();
                };

                /**
                 * 当联系人查询对话框关闭时， 清除UI数据
                 */
                $scope.onClose = function () {
                	view.importances =[];
                    view.items = [];
                    view.bpName = "";
                    view.userName = "";
                    view.userName = "";
                    view.importance = "";
                };

                /**
                 * 查询联系人
                 */
                $scope.searchContacts = function () {
                    view.currentPage = 1;
                    view.switchPage(view.currentPage, view.pageSize);
                };

                $scope.selectItem = function (item) {
                    view.selectedItem = item;
                };
                
                /**
                 * 联系人选择回调
                 */
                $scope.onSelected = function () {
                    if ($scope.onSelectedConfirm) {
                        if (view.selectedItem) {
                            $scope.onSelectedConfirm({
                                contact: view.selectedItem
                            });
                        }
                    }
                };
            }]
        };
    }]);
       

})();