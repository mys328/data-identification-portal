(function(){
    var uniformConstruction = angular.module("uniformConstruction", ["uniformModule"]);

    uniformConstruction.factory("constructionService", ["$http", "contextServer", function ($http, contextServer) {
        /**
         * 施工小队查询查询
         * @param data  施工小队查询参数
         * @param callback   查询成功后的回调函数
         */
        function getConstructionPage(queryObj, callback, errorCallback) {
            $http.jsonp(contextServer + "/ct/paas/us/commonresource/getConstructionInfo.do?callback=JSON_CALLBACK", {
                params: queryObj
            }).success(function (contacts) {          //  成功回调函数， contacts为标准的pageBean格式json对象
                if (callback) {
                    callback(contacts);
                }
            }).error(errorCallback);
        };
      
        return {
            getConstructionPage: function (queryObj, callback, errorCallback) {
            	getConstructionPage(queryObj, callback, errorCallback);
            }
        };
    }]);

    uniformConstruction.directive("searchConstructionDialog", ["contextServer", function (contextServer) {

        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/search.construction.jsp",
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
            controller: ["$scope", "constructionService", "uniformService", function ($scope, constructionService, uniformService) {
                
                var view = {
                    totalPage: 0,           // 总页数
                    totalCount: 0,          // 总记录数
                    pageSize: 10,           // 页尺寸
                    currentPage: 1,         // 当前页号
                    selectedItem: null,     // 跟踪当前选择的施工小队
                    items: [],              // 一页草稿数据
                   // classifications :[],   // 施工小队分级字典
                    cstName: "",           // 施工小队名称
                    cstCode: "",           // 施工小队编码
                    teamLeader: "",         // 施工小队队长
                    classification: "",         // 施工小队分级
                    cstStatus: "0",         // 施工小队状态
                    showMask: false,        // 查询项目草稿遮罩提示层
                    switchPage: function (currentPage, pageSize) {
                        view.showMask = true;
                        constructionService.getConstructionPage({
                            pageSize: pageSize,
                            currentPage: currentPage,
                            cstName: view.cstName,
                            cstCode: view.cstCode,
                            teamLeader: view.teamLeader,
                            classification: view.classification,
                            cstStatus: view.cstStatus
                        }, function (result) {
                            view.items = result.data || [];
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
                 * 当查询框显示的时候， 开始查询施工小队
                 */
                $scope.onShow = function () {
                    $scope.searchConstructions();
                };

                /**
                 * 当施工小队查询对话框关闭时， 清除UI数据
                 */
                $scope.onClose = function () {
                    view.items = [];
                    view.cstName = "";
                    view.cstCode = "";
                    view.teamLeader = "";
                    view.classification = "";
                    view.cstStatus = "0";
                };

                /**
                 * 查询施工小队
                 */
                $scope.searchConstructions = function () {
                    view.currentPage = 1;
                    view.switchPage(view.currentPage, view.pageSize);
                };

                $scope.selectItem = function (item) {
                    view.selectedItem = item;
                };
                
                /**
                 * 施工小队选择回调
                 */
                $scope.onSelected = function () {
                    if ($scope.onSelectedConfirm) {
                        if (view.selectedItem) {
                            $scope.onSelectedConfirm({
                            	construction: view.selectedItem
                            });
                        }
                    }
                };
            }]
        };
    }]);
       
    uniformConstruction.filter("statusFilter",function(){
        return function(filterData){  
        		var cstStatus="";
                   if(filterData == 0) {
                	   cstStatus= "正常";
                   } 
                   if(filterData == 1){
                	   cstStatus= "冻结"; 
                   }
                   return cstStatus;    
         }

    });
       

})();