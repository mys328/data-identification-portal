/**
 * 用户人员列表
 */
(function(){
    var uniformContract = angular.module("uniformUser", ["uniformModule"]);
    uniformContract.factory("userService", ["$http", "contextServer", function ($http, contextServer) {

        function getUserPage(queryObj, callback, errorCallback) {
        	$http.jsonp(contextServer + "/ct/paas/ct/resource/getUserList.do?callback=JSON_CALLBACK", {
                params: {
                    userName: queryObj.userName,             // 用户名称
                    account: queryObj.account,           	 // 用户账号
                    mobile: queryObj.mobile,       		     // 手机号码
                    orgPathName: queryObj.orgPathName,       // 所属部门
                    companyId: queryObj.companyId,           // 公司过滤条件
                    pageSize: queryObj.pageSize,             // 页尺寸
                    currentPage: queryObj.currentPage        // 当前页号
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
                userId: obj.userId,
                userName:obj.userName,
                account:obj.account,
                orgId:obj.orgId,
                mobile:obj.mobile,
                companyId:obj.companyId,
                orgName:obj.orgName,
                orgPathName:obj.orgPathName

            };

            var list = JSON.parse($.cookie(cacheName));

            if(list == undefined || list == null){
                list = [];
            }

            var flag = false;
            angular.forEach(list,function(item,index){
                if(item.userId == _obj.userId){
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
            getUserPage: function (queryObj, callback, errorCallback) {
                getUserPage(queryObj, callback, errorCallback);
            },
            saveCommon: function (obj, cacheName) {
                saveCommon(obj, cacheName);
            }
        };
    }]);

    uniformContract.directive("searchUserDialog", ["contextServer", function (contextServer) {

        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/search.user.jsp",
            scope: {
                showDialog: "=",
                modalTitle: "@",
                companyId: "=",        //companyId-1时则后台处理权限，获取当前登录人公司ID，否则就按companyId去过滤公司权限
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
            controller: ["$scope", "userService", function ($scope, userService) {

                //查询条件
                var loadListQueryView = {
                    userName: "",           // 用户名称
                    account: "",           	// 用户账号
                    mobile: "",       		// 手机号码
                    orgPathName: "",        // 所属部门
                    pageSize:5,             //当前页大小
                    currentPage:1           //当前页
                };

                $scope.loadListQueryView = loadListQueryView;
                //隐藏遮罩 false为关闭
                $scope.showMask = false;

                $scope.userDialogView = {
                    all: false
                }
                //缓存视图
                $scope.userCache = {

                }
                /**
                 * 当查询框显示的时候， 开始查询选择用户
                 */
                $scope.onShow = function () {
                    if(!$scope.companyId){
                        $scope.companyId = "-1";
                    }
                    $scope.userCache.data = JSON.parse($.cookie('userList'));
                    if(!$scope.userCache.data){
                        $scope.userCache.data = [];
                    }
                    $scope.switchPageByCache();
                    $scope.switchPage();
                };

                /**
                 * 当选择用户对话框关闭时， 清除UI数据
                 */
                $scope.onClose = function () {
                    //清空查询条件
                    $scope.loadListQueryView = {
                        userName: "",           // 用户名称
                        account: "",           	// 用户账号
                        mobile: "",       		// 手机号码
                        orgPathName: "",        // 所属部门
                        pageSize:5,             //当前页大小
                        currentPage:1           //当前页
                    };
                };
                
                /**
                 * 查询选择用户
                 */
                $scope.searchUsers = function () {
                    $scope.showMask = true;
                    userService.getUserPage($scope.loadListQueryView, function (userPage) {
                        $scope.userView = userPage;
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
                    $scope.loadListQueryView.companyId = $scope.companyId;
                    $scope.searchUsers();
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
                    var pageData  = $scope.userCache.data.slice((currentPage-1)*pageSize,currentPage*pageSize);
                    $scope.userCache.pageSize = pageSize;
                    $scope.userCache.currentPageSize = pageData.length;
                    $scope.userCache.currentPage = currentPage;

                    $scope.userCache.totalCount = $scope.userCache.data.length;
                    $scope.userCache.totalPage = Math.ceil($scope.userCache.totalCount/$scope.userCache.pageSize);
                    $scope.members = pageData;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }

                /**
                 * 跟踪选择用户
                 * @param item 用户当前行
                 */
                $scope.selectItem = function (item) {
                    $scope.selectedItem = item;
                };

                /**
                 * 选择用户选择回调
                 */
                $scope.onSelected = function () {
                    userService.saveCommon($scope.selectedItem,'userList');
                    if ($scope.onSelectedConfirm) {
                        if ($scope.selectedItem) {
                            $scope.onSelectedConfirm({
                                userItem: $scope.selectedItem
                            });
                        }
                    }
                };
            }]
        };
    }]);
    
})();