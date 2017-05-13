(function(){

    var uniformCommon = angular.module("uniformCommon", ["uniformModule"]);

    uniformCommon.factory("commonService", ["$http", "contextServer", function ($http, contextServer) {

        var categorys = {
            "area": contextServer + "/ct/paas/ct/resource/getConstructionArea.do?callback=JSON_CALLBACK",		        //区域
            "organization" : contextServer + "/ct/paas/ct/resource/getOrganization.do?callback=JSON_CALLBACK",	        //根据组织ID获取组织部门孩子树
            "specialty" : contextServer + "/ct/paas/ct/resource/getMajorType.do?callback=JSON_CALLBACK",		        //专业类型
            "pm" : contextServer + "/ct/paas/ct/resource/getManagerByOrgId.do?callback=JSON_CALLBACK",				    //项目经理信息
            "orgUsers": contextServer + "/ct/paas/ct/resource/getOrganizationByUserName.do?callback=JSON_CALLBACK"      //组织人员
        };
        
        var categorysByOften = {
                "area": contextServer + "/ct/paas/ct/resource/getConstructionAreaVisit.do?callback=JSON_CALLBACK",//施工区域常用项
                "organization" : contextServer + "/ct/paas/ct/resource/getOrganizationVisit.do?callback=JSON_CALLBACK",//负责部门常用项
                "specialty" : contextServer + "/ct/paas/ct/resource/getMajorTypeVisit.do?callback=JSON_CALLBACK",//专业类型常用项
                "pm" : ""//项目经理信息
            };

        var categorysByTreeAll = {
            "area": contextServer + "/ct/paas/ct/resource/getConstructionAreaAllTree.do?callback=JSON_CALLBACK",        //施工区域常用项
            "organization" : contextServer + "/ct/paas/ct/resource/getOrganizationAllTree.do?callback=JSON_CALLBACK",   //负责部门常用项
            "specialty" : contextServer + "/ct/paas/ct/resource/getMajorTypeAllTree.do?callback=JSON_CALLBACK",         //专业类型常用项
            "pm" : "",//项目经理信息
            "orgUsers": contextServer + "/ct/paas/ct/resource/getOrganizationAllTreeForUsers.do?callback=JSON_CALLBACK"      //组织人员
        };

        function getUsefulItems(category, callback, errorCallback) {
        	if(categorysByOften[category]){
        		$http.jsonp(categorysByOften[category]).success(function (nodes) {
                    if (callback) {
                        callback(nodes);
                    }
                }).error(errorCallback);
        	}
        };

        function getTreeNodes(category, id, matchName, callback, errorCallback) {
            $http.jsonp(categorys[category],{
                params: {
                    id: id,
                    matchName: matchName
                }
            }).success(function (nodes) {
                if (callback) {
                    callback(nodes);
                }
            }).error(errorCallback);
        };
        
        /*
         * 保存常用的cookie
         */
        var saveCommon = function(node, nodesName){
            var item = {};
            item.id = node.id;
            item.name = node.name;
            item.userId = node.userId;
            item.userName = node.userName;
            item.isLast = node.isLast;
            item.path = node.path;
            item.orgType = node.orgType;
            item.costCenter = node.costCenter;
            
            var list = JSON.parse($.cookie(nodesName));
            
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
//                console.log(ids)
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
        
        //查询业务字典树状结构
        function getBizDictTreeNodes(nodeKey, id, callback, errorCallback) {
        	var bizDictTreeNodes = contextServer + "/ct/paas/ct/resource/getBizDictTreeNodes.do?callback=JSON_CALLBACK";
            $http.jsonp(bizDictTreeNodes,{
                params: {
                	nodeKey: nodeKey,
                    id: id
                }
            }).success(function (nodes) {
            	angular.forEach(nodes, function (node) {
                    node._open = false;
                    node._loaded = false;
                    node.isLast = 'false';
                });
                if (callback) {
                    callback(nodes);
                }
            }).error(errorCallback);
        };

        function getOrganizationUsers(companyId, userName, callback, errorCallback) {
            $http.jsonp(contextServer + "/ct/paas/ct/resource/getOrganizationUsers.do?callback=JSON_CALLBACK", {
                params: {
                    companyId: companyId,
                    userName: userName
                }
            }).success(function (nodes) {
                if (callback) {
                    /*angular.forEach(nodes, function (node) {
                        if (node.users) {
                            node._children = node._children || [];
                            angular.forEach(node.users, function (user) {
                                node._children.push({
                                    id: user.userId,
                                    name: user.userName
                                });
                                node._children[node._children.length - 1]._parent = node;
                                node._children[node._children.length - 1].isLast = 'true';
                            });
                            node._open = true;
                            node._loaded = true;
                            if(node._children.length == 0){
                            	node.isLast = 'true';
                            }else{
                            	node.isLast = 'false';
                            }
                        }
                    });*/
                    callback(nodes);
                }
            }).error(errorCallback);
        };

        ///fm/paas/fm/resource/getCompanyInfo.do
        function getCompanyInfo(callback, errorCallback) {
            $http.jsonp(contextServer + "/ct/paas/ct/resource/getCurrCompanyInfo.do?callback=JSON_CALLBACK").success(function (org) {
                if (callback) {
                    callback(org);
                }
            }).error(errorCallback);
        };

        //获取业务字典键值对
        function getByNodeKey(nodeKey, callback, errorCallback) {
//            $http.get("/fm/paas/fm/resource/getByNodeKey.do",{
        	$http.jsonp(contextServer + "/ct/paas/ct/resource/getBizDictMapNodes.do?callback=JSON_CALLBACK", {
                params: {
                    nodeKey : nodeKey
                }
            }).success(function (dicts) {
                if (callback) {
                    callback(dicts);
                }
            }).error(errorCallback);
        };

        function getTreeNodesByAll(category, companyId, matchName, callback, errorCallback) {
            $http.jsonp(categorysByTreeAll[category],{
                params: {
                	id: companyId,
                    matchName: matchName
                }
            }).success(function (nodes) {
                if (callback) {
                    callback(nodes);
                }
            }).error(errorCallback);
        };

        /**
         * 根据公司ID和查询条件确定人员列表
         * @param companyId 公司ID
         * @param matchName 查询条件
         * @param callback
         * @param errorCallback
         */
        function getUsersData(companyId, matchName, callback, errorCallback) {
            $http.jsonp(contextServer + "/ct/paas/ct/resource/getOrdinaryUser.do?callback=JSON_CALLBACK",{
                params: {
                    id: companyId,
                    matchName: matchName
                }
            }).success(function (nodes) {
                if (callback) {
                    callback(nodes);
                }
            }).error(errorCallback);
        };
        
        //根绝项目类型获取项目状态（支持多选）
        function getProjStatus(nodeKey, callback, errorCallback) {
//            $http.get("/fm/paas/fm/resource/getByNodeKey.do",{
        	$http.jsonp(contextServer + "/ct/paas/ct/resource/getProjStatus.do?callback=JSON_CALLBACK", {
        		params: {
        			projType : nodeKey
        		}
        	}).success(function (dicts) {
        		if (callback) {
        			callback(dicts);
        		}
        	}).error(errorCallback);
        };
        return {
        	getProjStatus: function (category, callback, errorCallback) {
        		getProjStatus(category, callback, errorCallback);
            },
            getUsefulItems: function (category, callback, errorCallback) {
            	getUsefulItems(category, callback, errorCallback);
            },
            getTreeNodes: function (category, areaId, matchName, callback, errorCallback) {
                getTreeNodes(category, areaId, matchName, callback, errorCallback);
            },
            getOrganizationUsers: function (companyId, userName, callback, errorCallback) {
                getOrganizationUsers(companyId, userName, callback, errorCallback);
            },
            getByNodeKey: function (nodeKey, callback, errorCallback) {
                getByNodeKey(nodeKey, callback, errorCallback);
            },
            getCompanyInfo : function(callback, errorCallback){
            	getCompanyInfo(callback, errorCallback);
            },
            saveCommon : function(node,nodesName){
                saveCommon(node,nodesName);
            },
            getBizDictTreeNodes : function (nodeKey, id, callback, errorCallback) {
            	getBizDictTreeNodes(nodeKey, id, callback, errorCallback);
            },
            getTreeNodesByAll : function (category, companyId, matchName, callback, errorCallback) {
                getTreeNodesByAll(category, companyId, matchName, callback, errorCallback);
            },
            getUsersData : function (companyId, matchName, callback, errorCallback) {
                getUsersData(companyId, matchName, callback, errorCallback);
            }
        };
    }]);

    uniformCommon.directive("treeDialog", ["contextServer", function (contextServer) {

        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/tree.dialog.jsp",
            scope: {
                showDialog: "=",
                category: "@",
                orgId: "=",				//orgId为-1时则后台处理权限，获取当前登录人公司ID，否则就按orgId去过滤公司权限
                modalTitle: "@",
                dialogId: "@",
                confirmButton: "@",
                onlySelectLeaf: "@", 	//在组织机构时此值的意思改变，当此值为true时只能选择"orgType":4的节点，当为false或者默认（不传值）时只能选择"orgType":4且"costCenter"不为空的值
                onSelectedConfirm: "&"
            },
            compile: function (element, attrs) {

                return function (scope, element) {
                    scope.dbSelected = function (node) {
                        if (scope.onlySelectLeaf == 'true') {
                        	if(scope.category == 'organization'){
                            	if(node.orgType == 4){
                            		if (scope.onSelected) {
	                                    scope.onSelected();
	                                }
	                                angular.element(element.children("div")[0]).modal("hide");
                            	}
                            }else {
	                            if (node && node.isLast == "true") {
	                                if (scope.onSelected) {
	                                    scope.onSelected();
	                                }
	                                angular.element(element.children("div")[0]).modal("hide");
	                            }else if(scope.category == 'specialty' && node && node.parentId != 0){
	                            	if (scope.onSelected) {
	                                    scope.onSelected();
	                                }
	                                angular.element(element.children("div")[0]).modal("hide");
	                            }
                            }
                        } else {
                        	if(scope.category == 'organization'){
                            	if((node.orgType == 4)){
                            		if (scope.onSelected) {
    	                                scope.onSelected();
    	                            }
    	                            angular.element(element.children("div")[0]).modal("hide");
                            	}
                            }else {
	                            if (scope.onSelected) {
	                                scope.onSelected();
	                            }
	                            angular.element(element.children("div")[0]).modal("hide");
                            }
                        }
                    };
                }
            },
            controller: ["$scope", "commonService","$location", function($scope, commonService,$location) {
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
                	$scope.dialogId = $scope.dialogId || 'default';
                	$scope.$apply(function(){
                    	treeDialogView.filterField = '';
                	});
                	if(!$scope.orgId){
                		$scope.orgId = "-1";
                	}
                	$scope.reloadTree();
                	
                	$scope.getCompanyInfo();
                };
                
                var companyInfo = {};
                var nodesName = $scope.category;
                $scope.getCompanyInfo = function() {
                	commonService.getCompanyInfo(function (info) {
                		companyInfo = info;
                		nodesName = $scope.category + companyInfo.companyId;
                		if($scope.getUsefulItems){
                    		$scope.getUsefulItems(nodesName);
                    	}
                    }, function (error) {
                        pms.error(error.errorMessage);
                    });
                }

                $scope.getUsefulItems = function (nodesName) {
                	$scope.usefulItems = JSON.parse($.cookie(nodesName));
                };

                $scope.delayReloadTree = function () {
                	if('pm'==$scope.category){
                		if (timeId) {
                            clearTimeout(timeId);
                        }
                		timeId = setTimeout(function () {
                            $scope.reloadTree();
                        }, 500);
                	}else {
                        if (timeId) {
                            clearTimeout(timeId);
                        }
                        if(!$scope.treeDialogView.filterField){
                        	$scope.nodes = [];
                            timeId = setTimeout(function () {
                                $scope.reloadTree();
                            }, 500);
                        }else {
                        	$scope.nodes = {};
                            timeId = setTimeout(function () {
                            	$('.treeDialog').focus();
                                $scope.reloadQueryTree();
                            }, 500);
                        }
                	}
                    
                };
                
                $scope.reloadTree = function () {
                    treeDialogView.showMask = true;
                    if(!$scope.orgId){
                		$scope.orgId = "-1";
                	}
                	
                    commonService.getTreeNodes($scope.category, $scope.orgId, treeDialogView.filterField, function (nodes) {
                        $scope.nodes = nodes;
                        treeDialogView.showMask = false;
                    }, function (error) {
                        alert(error);
                        treeDialogView.showMask = false;
                    });
                };

                $scope.open = function (node) {
                    node._open = true;

                    if (!node._loaded) {
                        node._loading = true;
                        commonService.getTreeNodes($scope.category, node.id, treeDialogView.filterField, function (children) {
                            node._children = children;
                            if (node._children) {
                                for (var i = 0;i < node._children.length;i++) {
                                    node._children[i]._parent = node;
                                }
                            }
                            node._loaded = true;
                            node._loading = false;
                        }, function (error) {
                            alert(error);
                            treeDialogView.showMask = false;
                        });
                    }
                };

                $scope.close = function (node) {
                	$scope.treeDialogView.filterField = '';
                    node._open = false;
                };

                $scope.isVisible = function (node) {
                    var current = node._parent;
                    while (current) {
                        if (!current._open) {
                            return false;
                        }
                        current = current._parent
                    }
                    return true;
                };

                $scope.selected = function (node) {
                    if ($scope.onlySelectLeaf == 'true') {
                    	if($scope.category == 'organization'){
                        	if(node.orgType == 4){
                        		treeDialogView.selectedNode = node;
                        	}
                        }else {
                        	if (node.isLast == "true") {
                                treeDialogView.selectedNode = node;
                            }else if($scope.category == 'specialty' && node.parentId != 0){
                            	treeDialogView.selectedNode = node;
                            }
                        }
                    } else {
                    	if($scope.category == 'organization'){
                        	if((node.orgType == 4)){
                        		treeDialogView.selectedNode = node;
                        	}
                        }else {
                        	treeDialogView.selectedNode = node;
                        }
                    }
                };

                //查询树方法================================================//
                //判断是否显示合同分类树
                $scope.reloadQueryTree = function () {
                    if(!$scope.treeDialogView.filterField){
                        $('.queryInput').focus();
                        return;
                    }
                    treeDialogView.showMask = true;
                    commonService.getTreeNodesByAll($scope.category, $scope.orgId, $scope.treeDialogView.filterField, function (nodes) {
                        $scope.nodes = getTrees(nodes);
                        treeDialogView.showMask = false;
                        $('.queryInput').focus();
                    }, function (error) {
                        pms.error(error);
                        treeDialogView.showMask = false;
                        $('.queryInput').focus();
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
	                if($scope.category == 'organization'){
	                	if(!treeDialogView.selectedNode.costCenter && ($scope.onlySelectLeaf != 'true')){
	                		pms.warn("成本中心不存在，请联系翔云支撑中心");
	            			return;
	            		}
	                }
                	
                    commonService.saveCommon(treeDialogView.selectedNode,nodesName);
                    $scope.getUsefulItems(nodesName);
                    if ($scope.onSelectedConfirm) {
                        if (treeDialogView.selectedNode) {
                            $scope.onSelectedConfirm(treeDialogView.selectedNode);
                        }
                    }
                };
            }]
        };
    }]);
    
    uniformCommon.directive("treeDialogByQuery", ["contextServer", function (contextServer) {

        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/tree.dialog.jsp",
            scope: {
                showDialog: "=",
                category: "@",
                orgId: "=",				//orgId为-1时则后台处理权限，获取当前登录人公司ID，否则就按orgId去过滤公司权限
                modalTitle: "@",
                dialogId: "@",
                confirmButton: "@",
                onlySelectLeaf: "@", 	//在组织机构时此值的意思改变，当此值为true时只能选择"orgType":4的节点，当为false或者默认（不传值）时只能选择"orgType":4且"costCenter"不为空的值
                onSelectedConfirm: "&"
            },
            compile: function (element, attrs) {

                return function (scope, element) {
                    scope.dbSelected = function (node) {
                        if (scope.onlySelectLeaf == 'true') {
                        	if(scope.category == 'organization'){
                            	if(node.orgType == 4){
                            		if (scope.onSelected) {
	                                    scope.onSelected();
	                                }
	                                angular.element(element.children("div")[0]).modal("hide");
                            	}
                            }else {
	                            if (node && node.isLast == "true") {
	                                if (scope.onSelected) {
	                                    scope.onSelected();
	                                }
	                                angular.element(element.children("div")[0]).modal("hide");
	                            }else if(scope.category == 'specialty' && node && node.parentId != 0){
	                            	if (scope.onSelected) {
	                                    scope.onSelected();
	                                }
	                                angular.element(element.children("div")[0]).modal("hide");
	                            }
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
            controller: ["$scope", "commonService","$location", function($scope, commonService,$location) {
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
                	$scope.dialogId = $scope.dialogId || 'default';
                	if($scope.onlySelectLeaf != 'false'){
                		$scope.onlySelectLeaf = 'true';
                	}
                	$scope.$apply(function(){
                    	treeDialogView.filterField = '';
                	});
                	if(!$scope.orgId){
                		$scope.orgId = "-1";
                	}
                	$scope.reloadTree();
                	
                	$scope.getCompanyInfo();
                };
                
                var companyInfo = {};
                var nodesName = $scope.category;
                $scope.getCompanyInfo = function() {
                	commonService.getCompanyInfo(function (info) {
                		companyInfo = info;
                		nodesName = $scope.category + companyInfo.companyId;
                		if($scope.getUsefulItems){
                    		$scope.getUsefulItems(nodesName);
                    	}
                    }, function (error) {
                        pms.error(error.errorMessage);
                    });
                }

                $scope.getUsefulItems = function (nodesName) {
                	$scope.usefulItems = JSON.parse($.cookie(nodesName));
                };

                $scope.delayReloadTree = function () {
                	if('pm'==$scope.category){
                		if (timeId) {
                            clearTimeout(timeId);
                        }
                		timeId = setTimeout(function () {
                            $scope.reloadTree();
                        }, 500);
                	}else {
                        if (timeId) {
                            clearTimeout(timeId);
                        }
                        if(!$scope.treeDialogView.filterField){
                        	$scope.nodes = [];
                            timeId = setTimeout(function () {
                                $scope.reloadTree();
                            }, 500);
                        }else {
                        	$scope.nodes = {};
                            timeId = setTimeout(function () {
                            	$('.treeDialog').focus();
                                $scope.reloadQueryTree();
                            }, 500);
                        }
                	}
                    
                };
                
                $scope.reloadTree = function () {
                    treeDialogView.showMask = true;
                    if(!$scope.orgId){
                		$scope.orgId = "-1";
                	}
                	
                    commonService.getTreeNodes($scope.category, $scope.orgId, treeDialogView.filterField, function (nodes) {
                        $scope.nodes = nodes;
                        treeDialogView.showMask = false;
                    }, function (error) {
                        alert(error);
                        treeDialogView.showMask = false;
                    });
                };

                $scope.open = function (node) {
                    node._open = true;

                    if (!node._loaded) {
                        node._loading = true;
                        commonService.getTreeNodes($scope.category, node.id, treeDialogView.filterField, function (children) {
                            node._children = children;
                            if (node._children) {
                                for (var i = 0;i < node._children.length;i++) {
                                    node._children[i]._parent = node;
                                }
                            }
                            node._loaded = true;
                            node._loading = false;
                        }, function (error) {
                            alert(error);
                            treeDialogView.showMask = false;
                        });
                    }
                };

                $scope.close = function (node) {
                	$scope.treeDialogView.filterField = '';
                    node._open = false;
                };

                $scope.isVisible = function (node) {
                    var current = node._parent;
                    while (current) {
                        if (!current._open) {
                            return false;
                        }
                        current = current._parent
                    }
                    return true;
                };

                $scope.selected = function (node) {
                    if ($scope.onlySelectLeaf == 'true') {
                    	if($scope.category == 'organization'){
                        	if(node.orgType == 4){
                        		treeDialogView.selectedNode = node;
                        	}
                        }else {
                        	if (node.isLast == "true") {
                                treeDialogView.selectedNode = node;
                            }else if($scope.category == 'specialty' && node.parentId != 0){
                            	treeDialogView.selectedNode = node;
                            }
                        }
                    } else {
                    	treeDialogView.selectedNode = node;
                    }
                };

                //查询树方法================================================//
                //判断是否显示合同分类树
                $scope.reloadQueryTree = function () {
                    if(!$scope.treeDialogView.filterField){
                        $('.queryInput').focus();
                        return;
                    }
                    treeDialogView.showMask = true;
                    commonService.getTreeNodesByAll($scope.category, $scope.orgId, $scope.treeDialogView.filterField, function (nodes) {
                        $scope.nodes = getTrees(nodes);
                        treeDialogView.showMask = false;
                        $('.queryInput').focus();
                    }, function (error) {
                        pms.error(error);
                        treeDialogView.showMask = false;
                        $('.queryInput').focus();
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
                    commonService.saveCommon(treeDialogView.selectedNode,nodesName);
                    $scope.getUsefulItems(nodesName);
                    if ($scope.onSelectedConfirm) {
                        if (treeDialogView.selectedNode) {
                            $scope.onSelectedConfirm(treeDialogView.selectedNode);
                        }
                    }
                };
            }]
        };
    }]);

    uniformCommon.directive("orgUsers", ["contextServer", function (contextServer) {

        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/tree.user.dialog.jsp",
            scope: {
                showDialog: "=",
                companyId: "=",				//companyId-1时则后台处理权限，获取当前登录人公司ID，否则就按companyId去过滤公司权限
                modalTitle: "@",
                dialogId: "@",
                confirmButton: "@",
                onlySelectLeaf: "@",
                onSelectedConfirm: "&"
            },
            compile: function (element, attrs) {

                return function (scope, element) {
                    scope.dbSelected = function (node) {
                        if (scope.onSelected) {
                            scope.onSelected();
                        }
                        angular.element(element.children("div")[0]).modal("hide");
                    };
                }
            },
            controller: ["$scope", "commonService", function($scope, commonService) {
                $scope.contextServer = contextServer;
                $scope.filterField = "";
                $scope.selectedNode = null;
                $scope.showMask = false;
                $scope.all = false;
                $scope.usersList = [];

                var treeDialogView = {
                    filterField: "",
                    selectedNode: null,
                    selectedUser: null,
                    showMask: false,
                    all: false
                };

                var timeId;

                $scope.treeDialogView = treeDialogView;

                $scope.onShow = function () {
                	$scope.dialogId = $scope.dialogId || 'default';
                    $scope.$apply(function(){
                        treeDialogView.filterField = '';
                    });
                    if(!$scope.companyId){
                        $scope.companyId = "-1";
                    }
                    $scope.reloadQueryTree();

                    if($scope.getUsefulItems){
                        $scope.getUsefulItems('orgUsers');
                    }
                };

                $scope.getUsefulItems = function (nodesName) {
                    $scope.usefulItems = JSON.parse($.cookie(nodesName));
                };

                $scope.delayReloadTree = function () {
                    if (timeId) {
                        clearTimeout(timeId);
                    }
                    /*if(!$scope.treeDialogView.filterField){
                        timeId = setTimeout(function () {
                            $scope.reloadTree();
                        }, 500);
                    }else {
                        timeId = setTimeout(function () {
                            $scope.reloadQueryTree();
                        }, 500);
                    }*/
                    timeId = setTimeout(function () {
                        $scope.reloadQueryTree();
                    }, 500);
                };

                $scope.reloadTree = function () {
                    treeDialogView.showMask = true;
                    if(!$scope.companyId){
                        $scope.companyId = "-1";
                    }
                    commonService.getTreeNodes('orgUsers', $scope.companyId, treeDialogView.filterField, function (nodes) {
                        $scope.nodes = nodes;
                        treeDialogView.showMask = false;
                    }, function (error) {
                        alert(error);
                        treeDialogView.showMask = false;
                    });
                };

                $scope.open = function (node) {
                    node._open = true;

                    if (!node._loaded) {
                        node._loading = true;
                        commonService.getTreeNodes('organization', node.id, treeDialogView.filterField, function (children) {
                            node._children = children;
                            if (node._children) {
                                for (var i = 0;i < node._children.length;i++) {
                                    node._children[i]._parent = node;
                                }
                            }
                            node._loaded = true;
                            node._loading = false;
                        }, function (error) {
                            alert(error);
                            treeDialogView.showMask = false;
                        });
                    }
                };

                $scope.close = function (node) {
                    $scope.treeDialogView.filterField = '';
                    node._open = false;
                };

                $scope.isVisible = function (node) {
                    var current = node._parent;
                    while (current) {
                        if (!current._open) {
                            return false;
                        }
                        current = current._parent
                    }
                    return true;
                };

                /*$scope.selected = function (node) {
                    if ($scope.onlySelectLeaf == 'true') {
                        if (node.isLast == "true") {
                            treeDialogView.selectedNode = node;
                        }
                    } else {
                        treeDialogView.selectedNode = node;
                    }
                };*/
                $scope.selected = function (user) {
                    treeDialogView.selectedUser = user;
                };
                
                $scope.getUsersList = function (node) {
                    treeDialogView.showMask = true;
                    treeDialogView.selectedNode = node;
                    commonService.getUsersData(node.id, $scope.treeDialogView.filterField, function (data) {
                        $scope.usersList = data;
                        treeDialogView.showMask = false;
                    }, function (error) {
                        alert(error);
                        treeDialogView.showMask = false;
                    });
                }

                //查询树方法================================================//
                //判断是否显示合同分类树
                $scope.reloadQueryTree = function () {
                    treeDialogView.showMask = true;
                    commonService.getTreeNodesByAll('orgUsers',$scope.companyId, $scope.treeDialogView.filterField, function (nodes) {
                        $scope.nodes = getTrees(nodes);
                        treeDialogView.showMask = false;
                    }, function (error) {
                        alert(error);
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
                    commonService.saveCommon(treeDialogView.selectedUser,'orgUsers');
                    $scope.getUsefulItems('orgUsers');
                    if ($scope.onSelectedConfirm) {
                        if (treeDialogView.selectedUser) {
                            var obj ={
                                id: treeDialogView.selectedUser.userId,
                                name: treeDialogView.selectedUser.userName,
                                account: treeDialogView.selectedUser.account
                            }
                            $scope.onSelectedConfirm(obj);
                        }
                    }
                };
            }]
        };
    }]);

    uniformCommon.directive("orgUsers_old", ["contextServer", function (contextServer) {
        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/tree.dialog.forSearchingUsers.jsp",
            scope: {
                showDialog: "=",
                companyId: "=",
                modalTitle: "@",
                confirmButton: "@",
                onlySelectLeaf: "@",
                onSelectedConfirm: "&"
            },
            compile: function (element, attrs) {

                return function (scope, element, attrs) {
                    scope.dbSelected = function (node) {
                        if (scope.onlySelectLeaf == 'true') {
                            if (node && node.isLast == "true") {
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
            controller: ["$scope", "commonService", function($scope, commonService) {
                $scope.contextServer = contextServer;
                $scope.selectedNode = null;
                $scope.showMask = false;
                $scope.all = false;

                $scope.usersList = [{id:1,name:'张三'},{id:1,name:'张三'},{id:1,name:'张三'}];

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
                	if(!$scope.companyId){
                		$scope.companyId = 0;
                	}
                    if (!($scope.nodes && $scope.nodes.length > 0)) {
                        $scope.reloadTree();
                    }
                    if($scope.getUsefulItems){
                		$scope.getUsefulItems('orgUsers');
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
                        $scope.reloadTree();
                    }, 500);
                };

                $scope.reloadTree = function () {
                    treeDialogView.showMask = true;
                    if (!$scope.companyId) {
                    	$scope.companyId = 0;
                    }
//                    commonService.getOrganizationUsers($scope.companyId, treeDialogView.filterField, function (nodes) {
                    commonService.getTreeNodes('organization', $scope.companyId, treeDialogView.filterField, function (nodes) {
                        $scope.nodes = nodes;
                        treeDialogView.showMask = false;
                    }, function (error) {
                        alert(error);
                        treeDialogView.showMask = false;
                    });
                };

                $scope.open = function (node) {
                    node._open = true;
                    if (!node._loaded) {
                        node._loading = true;
                        commonService.getOrganizationUsers(node.id, treeDialogView.filterField, function (children) {
                            node._children = children;
                            if (node._children) {
                                for (var i = 0;i < node._children.length;i++) {
                                    node._children[i]._parent = node;
                                }
                            }
                            node._loaded = true;
                            node._loading = false;
                        }, function (error) {
                            alert(error);
                            treeDialogView.showMask = false;
                        });
                    }
                };

                $scope.close = function (node) {
                    node._open = false;
                };

                $scope.isVisible = function (node) {
                    var current = node._parent;
                    while (current) {
                        if (!current._open) {
                            return false;
                        }
                        current = current._parent
                    }
                    return true;
                };

                $scope.selected = function (node) {
                    if ($scope.onlySelectLeaf == 'true') {
                        if (node.isLast == "true") {
                            treeDialogView.selectedNode = node;
                        }
                    } else {
                        treeDialogView.selectedNode = node;
                    }
                };

                $scope.onSelected = function () {
                    commonService.saveCommon(treeDialogView.selectedNode, 'orgUsers');
                    $scope.getUsefulItems('orgUsers');
                    if ($scope.onSelectedConfirm) {
                        if (treeDialogView.selectedNode) {
                            $scope.onSelectedConfirm(treeDialogView.selectedNode);
                        }
                    }
                };
            }]
        };
    }]);
    
    
    //获取业务字典树状结构指令
    uniformCommon.directive("dictTreeDialog", ["contextServer", function (contextServer) {
        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/tree.dialog.jsp",
            scope: {
                showDialog: "=",
                nodeKey: "@",
                modalTitle: "@",
                confirmButton: "@",
                onlySelectLeaf: "@",
                onSelectedConfirm: "&"
            },
            compile: function (element, attrs) {
                return function (scope, element, attrs) {
                    scope.dbSelected = function (node) {
                        if (scope.onlySelectLeaf == 'true') {
                            if (node && node.isLast == "true") {
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
            controller: ["$scope", "commonService", function($scope, commonService) {
                $scope.contextServer = contextServer;
                $scope.filterField = "hello";
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
                    if (!$scope.nodes) {
                        $scope.reloadTree();
                    }
                };

                $scope.delayReloadTree = function () {
                    if (timeId) {
                        clearTimeout(timeId);
                    }
                    timeId = setTimeout(function () {
                        $scope.reloadTree();
                    }, 500);
                };

                $scope.reloadTree = function () {
                    treeDialogView.showMask = true;
                    commonService.getBizDictTreeNodes($scope.nodeKey, null, function (nodes) {
                        $scope.nodes = nodes;
                        treeDialogView.showMask = false;
                    }, function (error) {
                        alert(error);
                        treeDialogView.showMask = false;
                    });
                };

                $scope.open = function (node) {
                    node._open = true;

                    if (!node._loaded) {
                        node._loading = true;
                        commonService.getBizDictTreeNodes($scope.nodeKey, node.id, function (children) {
                            node._children = children;
                            if (node._children) {
                                for (var i = 0;i < node._children.length;i++) {
                                    node._children[i]._parent = node;
                                }
                            }
                            node._loaded = true;
                            node._loading = false;
                        }, function (error) {
                            alert(error);
                            treeDialogView.showMask = false;
                        });
                    }
                };

                $scope.close = function (node) {
                    node._open = false;
                };

                $scope.isVisible = function (node) {
                    var current = node._parent;
                    while (current) {
                        if (!current._open) {
                            return false;
                        }
                        current = current._parent
                    }
                    return true;
                };

                $scope.selected = function (node) {
                    if ($scope.onlySelectLeaf == 'true') {
                    	commonService.getBizDictTreeNodes($scope.nodeKey, node.id, function(data){
                    		if (data) {
                    			node.isLast = "false";
                    		} else {
                    			node.isLast = "true";
                    		}
                    	},function (error) {
                    		console.log(error);
                    	});
                        if (node.isLast == "true") {
                            treeDialogView.selectedNode = node;
                        }
                    } else {
                        treeDialogView.selectedNode = node;
                    }
                };

                $scope.onSelected = function () {
                    if ($scope.onSelectedConfirm) {
                        if (treeDialogView.selectedNode) {
                            $scope.onSelectedConfirm(treeDialogView.selectedNode);
                        }
                    }
                };
            }]
        };
    }]);

})();

