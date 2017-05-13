(function(){
    var constructionUnit = angular.module("constructionUnit", ["uniformModule"]);

    constructionUnit.factory("constructionUnitService", ["$http", "contextServer", function ($http, contextServer) {

        /**
         * 施工单位查询
         * @param data  施工单位查询参数
         * @param callback   查询成功后的回调函数
         */
        function getConstructionUnit(data, callback, errorCallback) {
        	$http.jsonp(contextServer + "/ct/paas/us/commonresource/list.do?callback=JSON_CALLBACK",{
        		 params: {
                 	unitName:data.unit[0].unitName,            // 施工单位名称
                 	unitCode:data.unit[0].unitCode,       //施工单位状态
                 	unitStatus:data.unit[0].unitStatus, 
                 	processStatus:data.unit[0].processStatus, 
                 	 pageSize:data.pageSize,
                     currentPage: data.currentPage,
                     unitShortName:data.unit[0].unitShortName,
                 }
            }).success(function (result) {
                if (callback) {
                	callback(result);
                }
            }).error(errorCallback);
        };

        
    
        
        
        
        return {
        	getConstructionUnit:function (queryObj, callback, errorCallback) {
        		getConstructionUnit(queryObj, callback, errorCallback);
            },
           
        };
    }]);
    
    
    constructionUnit.directive("searchCustomerunitDialog", ["contextServer", function (contextServer) {

        return {
            restrict: "A",
            templateUrl:contextServer + "/ct/js/tpl/search.customerunit.jsp",
            scope: {
                showDialog: "=",
                dialogId: "@",
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
            controller: ["$scope", "constructionUnitService","$filter", function ($scope, constructionUnitService,$filter) {

                var data = {
                    unit:[{
                    	unitName: "",            //施工单位名称
                    	unitCode:"",             //施工单位编码
                    	unitStatus:"0",          //施工单位状
                    	processStatus:"40",
                    	unitShortName:"" //项目简称
                    }],
                    pageSize: 5,                // 页尺寸
                    currentPage: 1              // 当前页号
                };

                var constructionUnitView = {
                    showMask: false,
                    totalPage: 0,              // 总页数
                    totalCount: 0,             // 总记录数
                    selectedConstructionUnit: null,
                    constructionUnits: []      // 一页施工单位记录
                };

                $scope.data = data;
                $scope.constructionUnitView = constructionUnitView;

                /**
                 * 打开事件
                 */
                $scope.onShow = function () {
                    $scope.searchConstructionUnit();
                };

                /**
                 * 关闭事件
                 */
                $scope.onClose = function () {
                	constructionUnitView.selectedConstructionUnit = null;
                	constructionUnitView.constructionUnits = [];
                	data.unit[0].unitName="";
                    data.unit[0].unitCode="";
                    data.unit[0].unitStatus="0";
                    data.unit[0].processStatus="40";
                    data.unit[0].unitShortName="";

                };

                /**
                 * 施工单位查询
                 */
                $scope.searchConstructionUnit = function () {
                	constructionUnitView.showMask = true;
                	constructionUnitService.getConstructionUnit($scope.data,function(result){
                		result.data.forEach(function(value,index){
                        	value.createDate = $filter('date')(value.createDate,'yyyy-MM-dd');
                        });
                		constructionUnitView.constructionUnits = result.data;
                		constructionUnitView.totalCount = result.totalCount;
                		constructionUnitView.totalPage = result.totalPage;
                		constructionUnitView.selectedConstructionUnit = null;
                		constructionUnitView.showMask = false;
                	},function(error){
                		constructionUnitView.showMask = false;
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
                    $scope.searchConstructionUnit();
                }

                /**
                 * 跟踪选择的施工单位
                 * @param constructionUnit
                 */
                $scope.selectConstructionUnit = function (constructionUnit) {
                	constructionUnitView.selectedConstructionUnit = constructionUnit;
                };

                /**
                 * 施工单位选择回调
                 */
                $scope.onSelected = function () {
                    if ($scope.onSelectedConfirm) {
                        $scope.onSelectedConfirm({
                        	constructionUnit: constructionUnitView.selectedConstructionUnit
                        });
                    }
                };

                /**
                 * 关闭事件
                 */
                $scope.clear = function () {
                	constructionUnitView.selectedConstructionUnit = null;
                	data.unit[0].unitName="";
                    data.unit[0].unitCode="";
                    data.unit[0].unitStatus="0";
                    data.unit[0].processStatus="40";
                    data.unit[0].unitShortName="";
                };


            }]
        }
    }]);
       

})();