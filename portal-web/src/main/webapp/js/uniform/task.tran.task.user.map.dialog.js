/**
 *
 * 流程选人弹框
 */

(function () {
    var taskChooseUser = angular.module("taskChooseUser", ["uniformModule"]);
    
    taskChooseUser.factory("taskChooseService", ["$http", "contextServer", function ($http, contextServer) {
        function getUserByTask(queryObj, callBack, errorCallback) {
            $http.jsonp(contextServer + "/ct/paas/ct/bpmtask/tranTaskUserMapForbusinessSystemByDialog.do?callback=JSON_CALLBACK",  {
                params: {
                    processType: queryObj.processType,
                    taskId: queryObj.taskId,
                    isStart: queryObj.isStart,
                    actDefId: queryObj.actDefId
                }
            }).success(function (result) {
                if (callBack) {
                    callBack(result);
                }
            }).error(errorCallback);
        }

        return {
            getUserByTask: function (queryObj, callback, errorCallback) {
                getUserByTask(queryObj, callback, errorCallback);
            }
        };
    }]);

    taskChooseUser.directive("taskChooseUserDialog", ["contextServer", function (contextServer) {

        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/taskTranTaskUserMapDialog.jsp",
            scope: {
                showDialog: "=",
                processType: "=",
                taskId: "=",
                isStart: "=", 
                dialogId: "@",
                modalTitle: "@",
                confirmButton: "@",
                onSelectedConfirm: "&",
                onClose:"&"
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
            controller: ["$scope", "$http", "taskChooseService", function ($scope, $http, taskChooseService) {
            	$scope.def = "";
                //当前选中值
                $scope.showMask = false;
                $scope.queryObj = {

                };
                $scope.selectUsers = [];
                $scope.selectNodes = [];
                $scope.formData = {};       //自由和并行存储方式


                $scope.onShow = function () {
                    $scope.formData = {};
                    $scope.userSelectType = 1;
                    $scope.selectNodes = [];
                    $scope.nodeTranUserList = [];
                    $scope.def = "";
                    $scope.defs = [];
                    $scope.showUser = false;
                    $scope.showDef = false;
                    $scope.getUserByTask();
                };

                $scope.checkDef = function(def){
                	$scope.def = def;
                };
                
                $scope.selectDef = function(){
                	if(!$scope.def){
                		pms.warn("请选择运行流程定义！");
                	}else{
                		$scope.getUserByTask();
                	}
                };
                
                $scope.getUserByTask = function(){
                    $scope.showMask = true;
                    $scope.queryObj.processType = $scope.processType;
                    $scope.queryObj.taskId = $scope.taskId;
                    $scope.queryObj.actDefId = $scope.def;
                    if($scope.taskId){
                    	$scope.queryObj.isStart = 0;
                    }else{
                    	$scope.queryObj.isStart = 1;
                    }
                    taskChooseService.getUserByTask($scope.queryObj, function (data) {
                    	if(!Array.isArray(data)){
                    		$scope.showUser = true;
                    		$scope.showDef = false;
                        if(!data.error){
                        $scope.nodeTranUserList = data.nodeTranUserList;
                        $scope.exeutorToUserMap = data.exeutorToUserMap;
                        $scope.endCondition = data.endCondition;
                        $scope.variables = data.variables;
                        $scope.variablesJson = data.variablesJson;
                        $scope.variablesNames = data.variablesNames;
                        $scope.selectPath = data.selectPath;
                        $scope.canChoicePath = data.canChoicePath;


                        if ($scope.nodeTranUserList[0].nodeUserMapSet.length > 0) {
                            $scope.isMultipleInstance = $scope.nodeTranUserList[0].nodeUserMapSet[0].isMultipleInstance;
                        } else {
                            $scope.isMultipleInstance = false;
                        }

                        if ($scope.selectPath == 1) {//自由
                            $scope.selectNodes.push($scope.nodeTranUserList[0].nodeId);
                        } else if ($scope.selectPath != 1 && !$scope.isMultipleInstance) {//并行
                            angular.forEach($scope.nodeTranUserList[0].nodeUserMapSet, function (item) {
                                $scope.selectNodes.push(item.nodeId);
                            });
                        } else if ($scope.isMultipleInstance) {//会签
                            angular.forEach($scope.exeutorToUserMap, function (item) {
                                angular.forEach(item, function (item1, key) {
                                    $scope.selectNodes.push(key);
                                });
                            });
                        }
                    }else{
                            pms.warn(data.msg);
                        }
                    	}else{
                    		$scope.showDef = true;
                    		$scope.showUser = false;
                    		$scope.defs = data;
                    	}
                        $scope.showMask = false;
                    }, function () {
                        pms.alert("服务器异常！");
                        $scope.showMask = false;
                    });

                }


                $scope.getUserNode = function (user) {
                    $scope.selectUsers = [];
                    $scope.executorUser.userId = user.type + "^" + user.executeId + "^" + user.executor;
                    $scope.selectUsers.push($scope.executorUser.userId);
                }

                $scope.getTaskNode = function (nodeId) {
                    $scope.selectNodes = [];
                    //自由选择节点，添加对应的任务节点ID，否则不添加
                    if($scope.selectPath == 1){
                        $scope.selectNodes.push(nodeId);
                    }
                }
                
                $scope.close = function(){
                	$scope.onClose();
                }

                /**
                 * 选择回调
                 */
                $scope.onSelected = function () {
                    var returnUsers = [];
                 if($scope.nodeTranUserList[0].nodeUserMapSet.length>0){
		                          
                    if($scope.selectPath == 1){//自由
                        var _temp = $scope.formData[$scope.selectNodes[0]];
                        if(!_temp){
                       	 pms.warn("请先选择审批人信息!");  
                        }else{
                            returnUsers.push(_temp);
                        }

                    }else if($scope.selectPath != 1 && !$scope.isMultipleInstance){// 并行/正常
                        var _num = 0;
                        angular.forEach($scope.selectNodes, function (item) {
                            if(!$scope.formData[item]){
                                _num = parseInt(_num) + 1;
                                return;
                            }
                            returnUsers.push($scope.formData[item]);
                        });
                        if(_num){
                            returnUsers = [];
                       	 	pms.warn("请先选择审批人信息!");  
                        }
                        /*需要传else {
                            $scope.selectNodes = [];//并行不传任务节点ID
                        }*/

                    }else if($scope.isMultipleInstance){//会签
                        var _num = [];
                        angular.forEach($scope.selectNodes, function (item, index) {
                            if(!$scope.formData[item] || $scope.formData[item] == 'false'){
                            	_num.push(index);
                                return;
                            }
                            returnUsers.push($scope.formData[item]);
                        });
                        if(returnUsers.length < 2 ){
                            returnUsers = [];
                        	pms.warn("每个角色至少选择1个审批人员!");  
                        }
                        $scope.selectNodes = [];
                        $scope.selectNodes.push($scope.nodeTranUserList[0].nodeId);
                        /*需要传else {
                            $scope.selectNodes = [];//会签不传任务节点ID
                        }*/
                        var _returnUsers = returnUsers.join();
                        returnUsers = [];
                        returnUsers.push(_returnUsers);
                    }
                    }
                    if ($scope.onSelectedConfirm) {
                        $scope.onSelectedConfirm({
                            returnNodes: $scope.selectNodes,
                            returnUsers: returnUsers
                        });
                    }
                }
                
            }]
        }
    }]);
})();
