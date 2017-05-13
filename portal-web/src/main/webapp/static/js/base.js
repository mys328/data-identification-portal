(function () {
    var base = angular.module("projectBase", []);

    base.factory("GlobalScope", [function () {

        var GlobalVariable = {};
        var msgBus = [];
        return {
            postMessage: function (msgId, args) {
                for (var i = 0;i < msgBus.length;i++) {
                    if (msgId == msgBus[i].msgId) {
                        msgBus[i].callback(args);
                    }
                }
            },
            registerMessage: function (msgId, callback) {
                var item = {
                    msgId: msgId,
                    callback: callback
                };
                msgBus.push(item);

                return function(){
                    var index = msgBus.indexOf(item);
                    msgBus.splice(index, 1);
                };
            },
            setVariable: function (name, value) {
                return GlobalVariable[name] = value;
            },
            getVariable: function (name) {
                return GlobalVariable[name];
            },
            resetGlobalVariable: function () {
                GlobalVariable = {};
            }
        };
    }]);

    base.factory("commonProjectService", ["$http", function ($http) {

        var categorys = {
            "area": "/pm/paas/pm/resource/getConstructionArea.do",
            "organization" : "/pm/paas/pm/resource/getOrganization.do",
            "specialty" : "/pm/paas/pm/resource/getMajorType.do",
            "pm" : "/pm/paas/pm/resource/getUsersByOrgId.do"
        };

        function getUsefulItems(category, callback) {

        };

        function getTreeNodes(category, id, matchName, callback, errorCallback) {
            $http.get(categorys[category],{
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

        function getNodeList(refId, category, callback) {
            $http.get(categorys[category], {
                params: {
                    id: refId
                }
            }).success(function (nodes) {
                if (callback) {
                    callback(nodes);
                }
            }).error(function (result) {
                alert(result);
            });
        };

        function buildChildrenCostTypeTree (costId,childrenCostType) {
            var map = {};
            for (var i = 0;i < childrenCostType.length;i++) {
                map[childrenCostType[i].costId] = childrenCostType[i];
            }
            var children = [];
            for (var i = 0;i < childrenCostType.length;i++) {
                var parent = map[childrenCostType[i].parentId];
                if (parent) {
                    if (!parent._children) {
                        parent._children = [];
                    }
                    parent._children.push(childrenCostType[i]);
                    childrenCostType[i]._parent = parent;
                }
                if (childrenCostType[i].parentId == costId) {
                    children.push(childrenCostType[i]);
                }
            }
            return children;
        };

        var childrenOfCostTypeCache = {};

        function findChildrenOfCostTypeByCostId(costId, callback, errorCallback) {
            if (childrenOfCostTypeCache[costId]) {
                callback(childrenOfCostTypeCache[costId]);
                return;
            }
            $http.get("/pm/paas/pm/costtype/findAllChildById.do", {
                params: {
                    costId: costId
                }
            }).success(function (childrenCostType) {
                childrenOfCostTypeCache[costId] = buildChildrenCostTypeTree(costId, childrenCostType);
                callback(childrenOfCostTypeCache[costId]);
            }).error(errorCallback);
        };

        function getUserInfo(callback, errorCallback) {
            $http.get("/pm/paas/pm/resource/getUserInfo.do").success(function (user) {
                if (callback) {
                    callback(user);
                }
            }).error(errorCallback);
        };
        
        function getCompanyInfo(callback, errorCallback) {
            $http.get("/pm/paas/pm/resource/getCompanyInfo.do").success(function (org) {
                if (callback) {
                    callback(org);
                }
            }).error(errorCallback);
        };

        function getByNodeKey(nodeKey, callback, errorCallback) {
            $http.get("/pm/paas/pm/resource/getByNodeKey.do",{
                params: {
                    nodeKey : nodeKey
                }
            }).success(function (dicts) {
                if (callback) {
                    callback(dicts);
                }
            }).error(errorCallback);
        };
        
        function getPageFromBpm(projId, callback, errorCallback) {
            $http.get("/pm/paas/pm/projectInfo/getPageFromBpm.do", {
                params: {
                    businessKey: projId,
                    key: "PROCESS_ITEMKEY_XMLX"
                }
            }).success(function (result) {
                if (callback) {
                    callback(eval(result));
                }
            }).error(errorCallback);
        };

        /**
	      * 附件类型查询
	      * @param activityType
	      * @param callback
	      */
		 function initDoc(activityType,callback){
	        	$http.get("/pm/paas/pm/projectDoc/initDoc.do", {
	                params: {
	                	activityType:activityType
	                }
	            }).success(function (data) {
	                if (callback){
	                    callback(data);
	                }
	            }).error(function (result) {
					 alert(result);
				 });
	        };
		 /**
		  * 上传路径
		  * @param activityType
		  * @param callback
		  */
		 function getUploadUrl(activityType,callback){
			 $http.get("/pm/paas/pm/resource/getAttachmentUploadPath.do", {
				 params: {
					 activityType:activityType
				 }
			 }).success(function (data) {
				 if (callback){
					 callback(data);
				 }
			 }).error(function (result) {
				 alert(result);
			 });
		 };
		 
		 
		 /**
		  * 查询项目
		  */
		 function queryMyProject(pars, callback) {
	        	//console.log(JSON.stringify(pars));
	        	$http.post("/pm/paas/pm/projectProcessInfo/queryProcessProject.do",pars).success(function (data) {
	        		if (callback) {
	        			callback(data);
	        		}
	        	}).error(function (result) {
	        		alert("error:"+result);
	        	});
	        };
        return {
            getUsefulItems: function (category, callback) {
                getUsefulItems(category, callback);
            },
            getTreeNodes: function (category, areaId, matchName, callback, errorCallback) {
                getTreeNodes(category, areaId, matchName, callback, errorCallback);
            },
            getNodeList: function (refId, category, callback) {
                getNodeList(refId, category, callback);
            },
            findChildrenOfCostTypeByCostId: function (costId, callback, errorCallback) {
                findChildrenOfCostTypeByCostId(costId, callback, errorCallback);
            },
            getUserInfo: function (callback, errorCallback) {
                getUserInfo(callback, errorCallback);
            },
            getByNodeKey: function (nodeKey, callback, errorCallback) {
                getByNodeKey(nodeKey, callback, errorCallback);
            },
            getCompanyInfo : function(callback, errorCallback){
            	getCompanyInfo(callback, errorCallback);
            },
            getPageFromBpm: function (projId, callback, errorCallback) {
                getPageFromBpm(projId, callback, errorCallback);
            },
            initDoc:function(activityType,callback){
  				initDoc(activityType,callback);
	   		},
	   		getUploadUrl:function(activityType,callback){
	   			getUploadUrl(activityType,callback);
	   		},
	   		queryMyProject:function(activityType,callback){
	   			queryMyProject(activityType,callback);
	   		}
        };
    }]);

    //预算子结构选择
    base.directive("childrenOfCostTypeDialog", [function () {
        return {
            restrict: "A",
            templateUrl: "../commonjs/temp/ChildrenOfCostTypeDialog.html",
            scope: {
                showDialog: "=",
                modalSize: "@",
                modalTitle: "@",
                confirmButton: "@",
                costTypeId: "@",
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
            controller: ["$scope", "commonProjectService", function($scope, commonProjectService){

                var view = {
                    tempRoot: {
                        isTempRoot: true,
                        _open: true,
                        _children: null
                    },
                    selectedCostType: null,
                    filterCostTypeName: null
                };
                $scope.view = view;

                $scope.$watch("showDialog", function (value) {
                    if (value) {
                        commonProjectService.findChildrenOfCostTypeByCostId($scope.costTypeId, function (costTypeChildren) {
                            for (var i = 0;i < costTypeChildren.length;i++) {
                                costTypeChildren[i]._parent = view.tempRoot;
                            }
                            view.tempRoot._children = costTypeChildren;
                        });
                    } else {
                        view.tempRoot._children = null;
                        view.filterCostTypeName = null;
                        $scope.selectCostType(null);
                    }
                });

                $scope.selectCostType = function (costType) {
                    if (costType && costType.isOther) {
                        return;
                    }
                    view.selectedCostType = costType;
                    if (view.selectedCostType) {
                        $scope.disabledConfirm = false;
                    } else {
                        $scope.disabledConfirm = true;
                    }
                };

                $scope.matchName = function(costType, name) {
                    if (!name) {
                        return true;
                    }
                    if (costType.name.indexOf(name) > -1) {
                        return true;
                    }

                    if (costType._children) {
                        for (var i = 0;i < costType._children.length; i++) {
                            if ($scope.matchName(costType._children[i], name)) {
                                return true;
                            }
                        }
                    }
                    return false;
                };

                $scope.matchANode = function (costType) {
                    if (!view.filterCostTypeName) {
                        return false;
                    }
                    return costType.name.indexOf(view.filterCostTypeName) > -1;
                };

                $scope.isVisible = function (costType) {
                    var current = costType._parent;
                    while (current) {
                        if (!current._open) {
                            return false;
                        }
                        current = current._parent
                    }
                    return true;
                };

                $scope.onSelected = function () {
                    if ($scope.onSelectedConfirm) {
                        $scope.onSelectedConfirm({
                            selectedItem: view.selectedCostType
                        });
                    }
                };
            }]
        };
    }]);

    base.directive("showModalDialog", [function () {
        return {
            restrict: "A",
            scope: {
                showModalDialog: "="
            },
            compile: function (element, attrs) {
                return function (scope, element, attrs) {
                    scope.$watch("showModalDialog", function (newValue) {
                        element.modal({
                            backdrop: "static",
                            keyboard: false,
                            show: !!newValue
                        });
                    });

                    element.on("hidden.bs.modal", function (e) {
                        scope.$apply(function () {
                            scope.showModalDialog = false;
                        });
                    });
                };
            }
        };
    }]);
    
    

    //展开收起
    base.directive("slideTogglePm", [function () {

        return {
            restrict: "A",
            scope: {
                refEl: "@",
                hide:"@",
                show:"@"
            },
            compile: function (element, attrs) {

                element.css("cursor", "pointer");
                element.css("text-decoration", "underline");
                element.css("background", "url('../commonjs/img/icon_check_down.png') no-repeat scroll right center transparent");
                element.html("展开");
                return function (scope, element, attrs) {
                	$(scope.refEl).hide();
                    element.click(function () {
                        $(scope.refEl).slideToggle();
                        if ($(this).hasClass("active")) {
                            element.css("backgroundImage", "url('../commonjs/img/icon_check_down.png')");
                            $(this).removeClass("active").html("展开");
                        } else {
                            element.css("backgroundImage", "url('../commonjs/img/icon_check_up.png')");
                            $(this).addClass("active").html("收起");
                        }
                    });
                    if (scope.show) {
                    	element.click();
                    }
                }
            }
        };
    }]);
    
    //展开收起
    base.directive("slideTogglesPm", [function () {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                element.find(".ser_bolck").slideToggle();
                element.find(".drop a").click(function(){
                    element.find(".ser_bolck").slideToggle();
                    if ($(this).hasClass("activi")) {
                        $(this).removeClass("activi").html("展开");
                    } else {
                        $(this).addClass("activi").html("收起");
                    }
                });
            }
        }
    }]);
    
    
    //项目经理选择
    base.directive("nodeListSelectedDialog", [function () {

        return {
            restrict: "A",
            templateUrl: "../commonjs/temp/nodelist.selected.dialog.html",
            scope: {
                showDialog: "=",
                category: "@",
                refId: "=",
                refName: "=",
                modalTitle: "@",
                confirmButton: "@",
                onSelectedConfirm: "&"
            },
            compile: function (element, attrs) {
                return function (scope, element, attrs) {
                    scope.dbSelected = function () {
                        if (scope.onSelected) {
                            scope.onSelected();
                        }
                        angular.element(element.children("div")[0]).modal("hide");
                    };
                }
            },
            controller: ["$scope", "commonProjectService", function($scope, commonProjectService) {
                $scope.filterField = "";
                $scope.selectedNode = null;
                $scope.usefulItems = [];

                $scope.getUsefulItems = function () {
                    commonProjectService.getUsefulItems($scope.category,function (usefulItems) {
                        $scope.usefulItems = usefulItems;
                    });
                };

                $scope.$watch("refId", function (value) {
                    if ($scope.refId) {
                        commonProjectService.getNodeList($scope.refId, $scope.category, function (nodes) {
                            $scope.nodes = nodes;
                        });
                    }
                });

                $scope.getUsefulItems();

                $scope.selected = function (item) {
                    $scope.selectedNode = item;
                };

                $scope.onSelected = function () {
                    if ($scope.onSelectedConfirm) {
                        $scope.onSelectedConfirm($scope.selectedNode);
                    }
                }
            }]
        };
    }]);
})();