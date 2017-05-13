(function(){
    var uniformBid = angular.module("uniformBid", ["uniformModule"]);

    uniformBid.factory("bidService", ["$http", "contextServer", function ($http, contextServer) {

        function getBid(data, callBack, errorCallback) {
            $http.jsonp(contextServer+"/ct/paas/us/commonresource/getAllPageWithFeedback.do?callback=JSON_CALLBACK",  {
                params: {
                    biddingCode: data.bid.biddingCode,
                    biddingName: data.bid.biddingName,
                    status: "6",
                    ind:"1",
                    pageSize: data.pageSize,                // 页尺寸
                    currentPage: data.currentPage           // 当前页号
                }
            }).success(function (result) {
                    if (callBack) {
                        callBack(result);
                    }
                }).error(errorCallback);
        }

        return {
            getBid: function (queryObj, callback, errorCallback) {
                getBid(queryObj, callback, errorCallback);
            }
          
        };
    }]);

    uniformBid.directive("searchBidDialog", ["contextServer", function (contextServer) {

        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/search.bid.jsp",
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
            controller: ["$scope", "bidService", function ($scope, bidService) {
                var data = {
                    bid: {
                        biddingCode: "",       // 投标编号
                        biddingName: ""      // 投标名称
                    },
                    pageSize: 5,       // 页尺寸
                    currentPage: 1      // 当前页号
                };

                var bidView = {
                    showMask: false,
                    totalPage: 0,           // 总页数
                    totalCount: 0,          // 总记录数
                    selectedBid: null,
                    bids: []                // 一页记录
                };
                
                $scope.data = data;
                $scope.bidView = bidView;
                
                $scope.onShow = function () {
                    $scope.searchBid();
                };

                $scope.onClose = function () {
                    bidView.selectedBid = null;
                    bidView.bids = [];
                    data.bid.biddingCode="";
                    data.bid.biddingName="";
                };
                
                /**
                 * 投标查询
                 */
                $scope.searchBid = function () {
                    bidView.showMask = true;
                    bidService.getBid($scope.data, function (result) {
                        bidView.bids = result.data;
                        bidView.totalCount = result.totalCount;
                        bidView.totalPage = result.totalPage;
                        bidView.selectedBid = null;
                        bidView.showMask = false;
                        console.log(bidView.bids);
                    }, function (error) {
                        bidView.showMask = false;
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
                        pageSize = 10;
                    }
                    data.pageSize = pageSize;
                    data.currentPage = currentPage;
                    $scope.searchBid();
                };

                /**
                 * 跟踪选择的投标信息
                 * @param bid
                 */
                $scope.selectBid = function (bid) {
                    $scope.bidView.selectedBid = bid;
                };

                /**
                 * 投标选择回调
                 */
                $scope.onSelected = function () {
                    if ($scope.onSelectedConfirm) {
                        $scope.onSelectedConfirm({
                            bidItem: $scope.bidView.selectedBid
                        });
                    }
                };
            }]
        }
    }]);
})();