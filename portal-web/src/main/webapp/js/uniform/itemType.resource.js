/**
 *
 * 物资-商品类型查询对话框
 */

(function () {
    var uniformItemType = angular.module("uniformItemType", ["uniformModule"]);

    uniformItemType.directive("searchItemtypeDialog", ["contextServer", function (contextServer) {

        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/search.itemType.jsp",
            scope: {
                showDialog: "=",
                modalTitle: "@",
                dialogId: "@",
                confirmButton: "@",
                poType: "=",				//采购订单分类编码（‘ZCS1’等），不传查询所有
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
            controller: ["$scope", "$http", function ($scope, $http) {
                var itemTypeView = {
                    companyName: '',//公司名称
                    type: '',//分类
                    itemTypeDes: '',//物资类型描述
                    itemTypeCode: '',//物资类型编码
                    costCode: ''//费用类型编码
                }

                //查询条件
                var loadListQueryView = {
                    itemTypeCode: "",               // 物资类型编码
                    itemTypeDes: "",                // 物资类型描述
                    costCode: "",                   // 费用类型编码
                    type: "",                       // 分类
                    orderType: $scope.poType,       //采购订单类型(主页面的)
                    pageSize:5,						//当前页大小
                    currentPage:1 					//当前页
                };
                //分页PageBean
                var pageView = {
                    pageSize:5,//当前页大小
                    currentPage:1,//当前页
                    totalPage: 0,// 总页数
                    totalCount: 0,// 总记录数
                    data:[] //数据存放数组
                }
                $scope.loadListQueryView = loadListQueryView;
                $scope.itemTypeView = pageView;
                //当前选中值
                $scope.selectedItemType = null;
                $scope.showMask = false;

                $scope.onShow = function () {
                    if(!$scope.poType){
                        $scope.poType = '';
                    }
                    $scope.loadListQueryView = {
                        itemTypeCode: "",               // 物资类型编码
                        itemTypeDes: "",                // 物资类型描述
                        costCode: "",                   // 费用类型编码
                        type: "",                       // 分类
                        orderType: $scope.poType,       //采购订单类型(主页面的)
                        pageSize:5,						//当前页大小
                        currentPage:1 					//当前页
                    };
                    $scope.switchPage();
                    getType();
                };

                /**
                 * 获取查询条件的下拉框
                 */
                function getType() {
                    $http.jsonp(contextServer + "/ct/paas/ct/resource/getItemMajorType.do?callback=JSON_CALLBACK")
                    .success(function (data) {
                        $scope.typeList = data;
                    }).error(function (error) {
                    });
                }

                /**
                 * x关闭按钮则清空数据
                 */
                $scope.onClose = function () {
                    $scope.selectedItemType = null
                    $scope.itemTypeView.data = [];
                };

                /**
                 * 物资类型查询
                 */
                $scope.searchItemType = function () {
                    $scope.showMask = true;
                    $http.jsonp(contextServer + "/ct/paas/ct/resource/itemTypePB.do?callback=JSON_CALLBACK", {
                    	params: {
	                        itemTypeCode: $scope.loadListQueryView.itemTypeCode,    // 物资类型编码
	                        itemTypeDes: $scope.loadListQueryView.itemTypeDes,      // 物资类型描述
	                        costCode: $scope.loadListQueryView.costCode,            // 费用类型编码
	                        orderType: $scope.poType,        						//采购订单类型(主页面的)
	                        pageSize: $scope.loadListQueryView.pageSize,            // 页尺寸
	                        currentPage: $scope.loadListQueryView.currentPage       // 当前页号
                    	}
                    }).success(function (dataPage) {
                        $scope.itemTypeView = dataPage;
                        $scope.showMask = false;
                    }).error(function (error) {
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
                        currentPage = 1;
                    }
                    if(!pageSize){
                        pageSize = 5;
                    }
                    $scope.itemTypeView.data = [];
                    $scope.loadListQueryView.currentPage = currentPage;
                    $scope.loadListQueryView.pageSize = pageSize;
                    $scope.searchItemType();
                }

                /**
                 * 跟踪选择的项目
                 * @param itemType
                 */
                $scope.selectItemType = function (itemType) {
                    $scope.selectedItemType = itemType;
                };

                /**
                 * 项目选择回调
                 */
                $scope.onSelected = function () {
                    if(!$scope.selectedItemType){
                        return;
                    }
                    if ($scope.onSelectedConfirm) {
                        $scope.onSelectedConfirm({
                            itemType: $scope.selectedItemType
                        });
                    }
                };
            }]
        }
    }]);
})();
