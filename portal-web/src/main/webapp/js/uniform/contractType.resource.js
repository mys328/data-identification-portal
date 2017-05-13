/**
 *
 * 选择工单对话框
 */

(function () {
    var uniformContractType = angular.module("uniformContractType", ["uniformModule"]);

    uniformContractType.factory("conTypeService", ["$http", "contextServer", function ($http, contextServer) {
        //保存常用的cookie
        var saveCommon = function(node,nodesName){
            var item = {};
            item.id = node.id;
            item.name = node.name;
            item.userId = node.userId;
            item.userName = node.userName;
            item.parent = {
                id: node.parent.id,
                name: node.parent.name
            }
            item.path = node.path;
            item.code = node.code;

            var list = JSON.parse($.cookie(nodesName));

            console.log("list:",list);
            console.log("item:",item);

            if(list == undefined || list == null){
                list = [];
            }
            if(list.length > 0){
                var ids = [];
                var userIds = [];
                angular.forEach(list,function(it,index){
                    if(it.id != undefined){
                        ids.push(it.id);
                        delete it.userId;
                        delete it.userName;
                    }else{
                        userIds.push(it.userId);
                        delete it.id;
                        delete it.name;
                    }
                });
                if((item.id && ids.indexOf(item.id) == -1)
                    || (item.userId && userIds.indexOf(item.userId)) == -1){
                    list.unshift(item);
                    if(list.length > 5){
                        list.pop();
                    }
                }
            }else{
                list.unshift(item);
            }

            $.cookie(nodesName,JSON.stringify(list),{ expires: 365});
        };

        function getTreeNodesByAll(callback, errorCallback) {
            $http.jsonp(contextServer + "/ct/paas/ct/resource/getContractDetailTypeAsTree.do?callback=JSON_CALLBACK", {
                params: {
                	queryType: 'contractDetailTypeList'
                }
            }).success(function (nodes) {
                if (callback) {
                    callback(nodes);
                }
            }).error(errorCallback);
        };

        return {
            saveCommon : function(node,nodesName){
                saveCommon(node,nodesName);
            },
            getTreeNodesByAll : function (callback, errorCallback) {
                getTreeNodesByAll(callback, errorCallback);
            }
        };
    }]);

    uniformContractType.directive("contractTypeDialog", ["contextServer", function (contextServer) {

        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/search.contractType.jsp",
            scope: {
                showDialog: "=",
                modalTitle: "@",
                confirmButton: "@",
                onlySelectLeaf: "@",
                onSelectedConfirm: "&"
            },
            compile: function (element, attrs) {
                return function (scope, element) {
                    scope.dbSelected = function (node) {
                        if (scope.onlySelectLeaf == 'true') {
                            if (node.parent.id) {
                                if (scope.onSelected) {
                                    scope.onSelected();
                                }
                                angular.element(element.children("div")[0]).modal("hide");
                            }
                        } else {
                            if (scope.onSelected) {
                                scope.onSelected();
                            }
                            angular.element(element.children("div")[0]).modal("hide");
                        }
                    };
                }
            },
            controller: ["$scope", "$timeout", "conTypeService", function ($scope, $timeout, conTypeService) {
            	$scope.contextServer = contextServer;
                $scope.filterField = "";
                $scope.selectedNode = null;
                $scope.showMask = false;
                $scope.all = false;
                
                var treeDialogView = {
                    filterField: "",
                    selectedNode: null,
                    showMask: false,
                    all: false
                };

                var timeId;

                $scope.treeDialogView = treeDialogView;

                $scope.onShow = function () {
                    $scope.$apply(function(){
                        treeDialogView.filterField = '';
                    });

                    $scope.reloadQueryTree();
                    if($scope.getUsefulItems){
                        $scope.getUsefulItems('contractType');
                    }
                };

                $scope.getUsefulItems = function (nodesName) {
                    $scope.usefulItems = JSON.parse($.cookie(nodesName));
                };

                $scope.delayReloadTree = function () {
                    if (timeId) {
                        clearTimeout(timeId);
                    }
                    timeId = setTimeout(function () {
                        $scope.reloadQueryTree();
                    }, 500);
                };

                $scope.close = function (node) {
                    $scope.treeDialogView.filterField = '';
                    node._open = false;
                };

                $scope.selected = function (node) {
                    if ($scope.onlySelectLeaf == 'true') {
                        if (node.parent.id) {
                            treeDialogView.selectedNode = node;
                        }
                    } else {
                        treeDialogView.selectedNode = node;
                    }
                };

                //查询树方法================================================//
                //判断是否显示合同分类树
                $scope.reloadQueryTree = function () {
                    treeDialogView.showMask = true;
                    conTypeService.getTreeNodesByAll(function (nodes) {
                        //上下级关系
                        nodes.parent = null;
                        $scope.nodes = getTrees(nodes);
                        treeDialogView.showMask = false;
                    }, function (error) {
                        pms.error(error.errorMessage);
                        treeDialogView.showMask = false;
                    });
                };
                $scope.isShown = function (node) {
                    var show = true;
                    if (node.parent) {
                        var current = node.parent;
                        while (current != null) {
                            if (!current.open) {
                                show = false;
                                break;
                            }
                            current = current.parent;
                        }
                    }
                    if (node.name == "root") {
                        show = false;
                    }
                    return show;
                }
                //层级关系
                $scope.getLevel = function (node) {
                    var level = 0;
                    var current = node;
                    while (current != null) {
                        level++;
                        current = current.parent;
                    }
                    return level;
                }
                $scope.getStyle = function (level) {
                    return {
                        paddingLeft: (level * 20) + "px"
                    };
                }
                /*获取树的上下级关系*/
                function getTrees(node) {
                    var nodes = [];
                    nodes.push(node);
                    if (node.children) {
                        for (var i = 0; i < node.children.length; i++) {
                            node.children[i].parent = node;
                            nodes = nodes.concat(getTrees(node.children[i]));
                        }
                    }
                    return nodes;
                }
                //查询树方法================================================//

                $scope.onSelected = function () {
                    conTypeService.saveCommon(treeDialogView.selectedNode, 'contractType');
                    $scope.getUsefulItems('contractType');
                    if ($scope.onSelectedConfirm) {
                        if (treeDialogView.selectedNode) {
                            $scope.onSelectedConfirm({node: treeDialogView.selectedNode});
                        }
                    }
                };

            }]
        }
    }]);
})();
