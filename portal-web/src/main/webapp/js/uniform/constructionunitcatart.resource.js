(function(){
    var constructionUnit = angular.module("constructionUnitcatart", ["uniformModule"]);

    constructionUnit.factory("constructionUnitContactService", ["$http", "contextServer", function ($http, contextServer) {

     
        
        /**
         * 联系人查询
         * @param data    联系人查询参数
         * @param callback
         */
        function getContactPage(queryObj, callback, errorCallback) {
            $http.jsonp(contextServer + "/ct/paas/us/commonresource/getContactsList.do?callback=JSON_CALLBACK", {
                params: queryObj
            }).success(function (contacts) {          //  成功回调函数， contacts为标准的pageBean格式json对象
                if (callback) {
                    callback(contacts);
                }
            }).error(errorCallback);
        };

        
        
        
        return {
            getContactPage: function (queryObj, callback, errorCallback) {
            getContactPage(queryObj, callback, errorCallback);
        },
        };
    }]);
    
    
  

    constructionUnit.directive("searchContactlistDialog", ["contextServer", function (contextServer) {

        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/search.contactlist.jsp",
            scope: {
            	unitCode:"=",
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
            
            controller: ["$scope", "constructionUnitContactService", "uniformService", function ($scope, constructionUnitContactService, uniformService) {
            	 
                var view = {
                    totalPage: 0,           // 总页数
                    totalCount: 0,          // 总记录数
                    pageSize: 5,           // 页尺寸
                    currentPage: 1,         // 当前页号
                    selectedItem: null,     // 跟踪当前选择的联系人
                    items: [],              // 一页草稿数据
                    unitName: "",           // 施工单位名称
                    contactName: "",           // 联系人姓名
                    unitCode: "",         // 施工单位编码编码
                    showMask: false,        // 查询项目草稿遮罩提示层
                    switchPage: function (currentPage, pageSize) {
                        view.showMask = true;
                        constructionUnitContactService.getContactPage({
                            pageSize: pageSize,
                            currentPage: currentPage,
                            unitName: view.unitName,
                            unitCode: $scope.unitCode,
                            contactName:view.contactName,
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
                    $scope.searchContacts();
                };

                /**
                 * 当联系人查询对话框关闭时， 清除UI数据
                 */
                $scope.onClose = function () {
          
                    view.items = [];
                    view.unitCode = "";
                    view.contactName = "";
                    view.unitName = "";
     
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