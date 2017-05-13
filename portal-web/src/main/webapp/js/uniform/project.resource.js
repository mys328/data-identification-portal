(function(){

    var uniformProject = angular.module("uniformProject", ["uniformModule","uniformCommon","uniformUser"]);

    uniformProject.factory("projectService", ["$http", "contextServer", function ($http, contextServer) {

    	function getOrderPage(queryObj, callback, errorCallback) {
            $http.jsonp(contextServer + "/ct/paas/us/commonresource/getOrderDetail.do?callback=JSON_CALLBACK", {
                params: queryObj
            }).success(function (result) {
                if (callback) {
                    callback(result);
                }
            }).error(errorCallback);
        };
        function getCompanyInfo(callback, errorCallback) {
            $http.jsonp(contextServer + "/ct/paas/ct/resource/getCurrCompanyInfo.do?callback=JSON_CALLBACK").success(function (org) {
                if (callback) {
                    callback(org);
                }
            }).error(errorCallback);
        };
        function getProjectPage(queryObj, callback, errorCallback) {
            $http.jsonp(contextServer + "/ct/paas/us/commonresource/getProjectPage.do?callback=JSON_CALLBACK", {
                params: queryObj
            }).success(function (result) {
                if (callback) {
                    callback(result);
                }
            }).error(errorCallback);
        };

        function getProjStatus(projType, callback, errorCallback) {
            $http.jsonp(contextServer + "/ct/paas/ct/resource/getProjStatus.do?callback=JSON_CALLBACK", {
                params: {
                    projType: projType
                }
            }).success(function (result) {
                if (callback) {
                    callback(result);
                }
            }).error(errorCallback);
        };
        
        function getProjStatus2( callback, errorCallback) {
        	$http.jsonp(contextServer + "/ct/paas/ct/resource/getProjStatus.do?callback=JSON_CALLBACK", {
        		params: {
        			projType: 'SJ',
        			isContainClose :0
        		}
        	}).success(function (result) {
        		if (callback) {
        			callback(result);
        		}
        	}).error(errorCallback);
        };
        
        function getDesignFascicle(pars, callback) {//质量评分模板
        	//console.log(JSON.stringify(pars));
        	$http.jsonp(contextServer + "/ct/paas/us/commonresource/getDesignFascicle.do?callback=JSON_CALLBACK", {
        		params: {
        			pageSize : pars.pageSize,
        			currentPage : pars.currentPage,
        			projId : pars.projId,//项目Id
        			fcCode : pars.fcCode,//分册编号
        			fcName : pars.fcName,//分册名称
        			headUserId : pars.headUserId, //分册负责人
        			volumeStatus : pars.volumeStatus ,//分册状态  下拉列表
        			schCode:pars.schCode,
        			projCode:pars.projCode
                }
        	}).success(function (structTemplate) {
        		if (callback) {
        			callback(structTemplate);
        		}
        	}).error(function (result) {
        		//alert("error:"+result);
        	});
        };
        
        function getDynamicSelProjParam(queryObj, callback, errorCallback) {
            $http.jsonp(contextServer + "/ct/paas/us/commonresource/getDynamicSelProjParam.do?callback=JSON_CALLBACK", {
                params: {
                	queryResource: queryObj.queryResource
                }
            }).success(function (result) {
                if (callback) {
                    callback(result);
                }
            }).error(errorCallback);
        };
        function getInformation(projId, callback, errorCallback) {
        	$http.jsonp(contextServer + "/ct/paas/us/commonresource/getInformation.do?callback=JSON_CALLBACK", {
        		params: {
        			projId: projId
        		}
        	}).success(function (result) {
        		if (callback) {
        			callback(result);
        		}
        	}).error(errorCallback);
        };
        
        return {
        	getOrderPage: function (queryObj, callback, errorCallback) {
        		getOrderPage(queryObj, callback, errorCallback);
            },
            
            getProjectPage: function (queryObj, callback, errorCallback) {
                getProjectPage(queryObj, callback, errorCallback);
            },

            getProjStatus: function (projType, callback, errorCallback) {
                getProjStatus(projType, callback, errorCallback);
            },
            getCompanyInfo: function ( callback, errorCallback) {
            	getCompanyInfo( callback, errorCallback);
            },
            getProjStatus2: function (callback, errorCallback) {
            	getProjStatus2(callback, errorCallback);
            },
            
            getDesignFascicle: function (pars, callback, errorCallback) {
            	getDesignFascicle(pars, callback, errorCallback);
            },
            
            getDynamicSelProjParam: function (queryObj, callback, errorCallback) {
            	getDynamicSelProjParam(queryObj, callback, errorCallback);
            },
            getInformation: function (projId, callback, errorCallback) {
            	getInformation(projId, callback, errorCallback);
            }
        };
    }]);

    
    
    uniformProject.directive("searchOrderDialog", ["contextServer", function (contextServer) {

        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/search.order.jsp",
            scope: {
                showDialog: "=",
                modalTitle: "@",
                projCode: "=",
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
            controller: ["$scope", "projectService", "uniformService", function ($scope, projectService, uniformService) {

                var view = {
                    totalPage: 0,           // 总页数
                    totalCount: 0,          // 总记录数
                    pageSize: 5,           // 页尺寸
                    currentPage: 1,         // 当前页号
                    selectedItem: null,     // 跟踪当前选择的草稿
                    items: [],              // 一页草稿数据
                    projCode: "",           // 项目编号
                    orderNumber: "",           // 工单编号
                    orderName: "",         // 工单名称
                    serialNumber: "",         // 工单流水号
                    showMask: false,        // 查询项目草稿遮罩提示层
                    switchPage: function (currentPage, pageSize) {
                        view.showMask = true;
                        projectService.getOrderPage({
                            pageSize: pageSize,
                            currentPage: currentPage,
                            projCode: $scope.projCode,
                            orderNumber: view.orderNumber,
                            orderName: view.orderName,
                            serialNumber: view.serialNumber
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
                 * 当查询框显示的时候， 开始查询项目草稿
                 */
                $scope.onShow = function () {
                    $scope.searchOrders();
                };

                /**
                 * 当工单查询对话框关闭时， 清除UI数据
                 */
                $scope.onClose = function () {
                    view.items = [];
                    view.projCode = "";
                    view.orderNumber = "";
                    view.orderName = "";
                    view.serialNumber = "";
                };

                /**
                 * 查询项目工单
                 */
                $scope.searchOrders = function () {
                    view.currentPage = 1;
                    view.switchPage(view.currentPage, view.pageSize);
                };

                $scope.selectItem = function (item) {
                    view.selectedItem = item;
                };
                
                /**
                 * 项目工单选择回调
                 */
                $scope.onSelected = function () {
                    if ($scope.onSelectedConfirm) {
                        if (view.selectedItem) {
                            $scope.onSelectedConfirm({
                                order: view.selectedItem
                            });
                        }
                    }
                };
            }]
        };
    }]);
    
    
    
    uniformProject.directive("searchProjectDialog", ["contextServer", function (contextServer) {

        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/search.project.jsp",
            scope: {
                showDialog: "=",
                modalTitle: "@",
                dialogId: "@",
                privileges: "=",
                customParameter: "=",
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
            controller: ["$scope", "projectService", "uniformService", function ($scope, projectService, uniformService) {

                var view = {
                    totalPage: 0,           // 总页数
                    totalCount: 0,          // 总记录数
                    pageSize: 5,           // 页尺寸
                    currentPage: 1,         // 当前页号
                    selectedItem: null,     // 跟踪当前选择的草稿
                    items: [],              // 一页草稿数据
                    natureName: {
                        "10": "正式项目",
                        "20": "应急项目"
                    },
                    projCode: "",           // 项目编号
                    projName: "",           // 项目名称
                    createName: "",         // 创建人
                    createDate: "",         // 创建日期
                    showMask: false,        // 查询项目草稿遮罩提示层
                    deptDialog: false,      //负责部门弹出层
                    pmDialog: false,        //项目经理弹出层
                    switchPage: function (currentPage, pageSize) {
                        view.showMask = true;
                        projectService.getProjectPage({
                            pageSize: pageSize,
                            currentPage: currentPage,
                            projCode: view.projCode,
                            projShortname: view.projShortname,
                            projCustomCode: view.projCustomCode,
                            chargeOrg: view.chargeOrg,
                            pmId: view.pmId,
                            projType: view.projType,
                            projProcessCode: view.projProcessCode,
                            projNature: view.projNature,
                            queryResource: $scope.privileges,
                            customParameter:$scope.customParameter
                            
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
                 * 获取项目类型
                 */
                function getProjType(){
                	 uniformService.getByNodeKey("PM_XMLX", function (dicts) {
                         view.projTypeNames = {};
                         //项目类型过滤
                         if(view.customParamObj && view.customParamObj.projType){
                        	 view.projTypes = [];
                         	angular.forEach(dicts, function (item) {
                         		if(view.customParamObj.projType.indexOf(item.itemKey) >= 0){
                         			view.projTypes.push(item);
                         		}
                             });
                         }else{
                         	 view.projTypes = dicts;
                         }
                         angular.forEach(dicts, function (item) {
                             view.projTypeNames[item.itemKey] = item.itemName;
                         });
                     });
                }
                

                $scope.changeProjType = function () {
                	projectService.getProjStatus(view.projType, function (dicts) {
                        view.statusNames = {};
                        view.statusList = dicts;
                        view.projProcessCode = '';
                        angular.forEach(dicts, function (item) {
                            view.statusNames[item.itemKey] = item.itemName;
                        });
                    }, function (error) {
                        alert(error);
                    });
                };
                
                /*$scope.$watch('privileges', function(){
                	getResultMapDic();
                });*/

                /**
                 * 当查询框显示的时候， 开始查询项目项目信息
                 */
                $scope.onShow = function () {
                	initCustomParamter();
                	getResultMapDic();
                	getProjType();
                    //$scope.searchProjects();
                    projectService.getCompanyInfo(function(data){
                    	if(data!=""){
//                    		$scope.queryBean.compIdList.push(parseInt(data.orgId));
//                    		$scope.companyId.push(parseInt(data.orgId));
                    		$scope.companyId1=parseInt(data.companyId);
                    		$scope.orgId=parseInt(data.orgId);
                    	}
                    }); 
                };
                
                /**
                 * 初始化自定义查询参数
                 */
                function initCustomParamter(){
                	if($scope.customParameter){
                		view.customParamObj = JSON.parse($scope.customParameter);
                	}
                }

                /**
                 * 当项目草稿对话框关闭时， 清除UI数据
                 */
                $scope.onClose = function () {
                    view.items = [];
                    view.projCode = "";
                    view.projShortname = "";
                    view.pmName = "";
                    view.projCustomCode = "";
                    view.pmId = "";
                    view.chargeOrgName = "";
                    view.chargeOrg = "";
                    view.projType = "";
                    view.projProcessCode = "";
                    view.projNature = "";
                    
                    view.totalPage = 0;
                    view.totalCount = 0;
                };
                
                $scope.clearData = function () {
                    view.projCode = "";
                    view.projShortname = "";
                    view.pmName = "";
                    view.projCustomCode = "";
                    view.pmId = "";
                    view.chargeOrgName = "";
                    view.chargeOrg = "";
                    view.projType = "";
                    view.projProcessCode = "";
                    view.projNature = "";
                }

                /**
                 * 查询项目信息
                 */
                $scope.searchProjects = function () {
                    view.currentPage = 1;
                    view.switchPage(view.currentPage, view.pageSize);
                };

                $scope.selectItem = function (item) {
                    view.selectedItem = item;
                };

                /**
                 * 负责部门回调函数
                 */
                $scope.selectDept = function (id, name) {
                    view.chargeOrgName = name;
                    view.chargeOrg = id;
                }

                /**
                 * 负责部门回调函数
                 */
                $scope.selectPm = function (userItem) {
                    view.pmName = userItem.userName;
                    view.pmId = userItem.userId;
                }
                
                /**
                 * 下拉框等查询条件初始化
                 */
                function getResultMapDic(){
                	projectService.getDynamicSelProjParam({
                        queryResource: $scope.privileges
                    }, function (result) {
                        $scope.resultMapDic = result;
//                        view.showMask = false;
                    }, function (result) {
                        pms.warn(result);
//                        view.showMask = false;
                    });
                }

                /**
                 * 项目草稿选择回调
                 */
                $scope.onSelected = function () {
                    if ($scope.onSelectedConfirm) {
                        if (view.selectedItem) {
                            $scope.onSelectedConfirm({
                                projectItem: view.selectedItem
                            });
                        }
                    }
                };
            }]
        };
    }]);
    
    /**
     * 选择分册 optionFascicle
     */
    uniformProject.directive("optionFascicleDialog", ["contextServer", function (contextServer) {

        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/fascicleMessage.jsp",
            scope: {
                showDialog: "=",
               // mdmcode: "=",
                modalTitle: "@",
                confirmButton: "@",
                onSelectedConfirm: "&",
                projectId:"=",
                schCode:"=",
                projCode:"=",
                fcSchid:"="
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
            controller: ["$scope", "projectService", function ($scope, projectService) {
            	$scope.getTime = function getTime(date){
            		var d = new Date(date);
            		return d;
            	}
                var view = {
                    totalPage: 0,           // 总页数
                    totalCount: 0,          // 总记录数
                    pageSize:5,
                    /*selectedContact: null,  // 跟踪选择的联系人
                    contactName: "",        // 联系人姓名
*/                  schDrafts: [] ,           // 草稿
	                showMask : false,
					selectedProject: null,
		    		currentPage : 1,
		    		fenceType:[]
                };

                var data = {
                    data: {
                    	pageSize:"5",
	        			currentPage:"1",
	        			projId:"",//项目Id
	        			fcCode:"",//分册编号
	        			fcName:"",//分册名称
	        			headUserName:"", //分册负责人
	        			volumeStatus:"" //分册状态  下拉列表
                    }
                };
                $scope.view = view;
                $scope.data = data;
                $scope.getProjectList = function getProjectList(){
            		var	obj = {
	        			pageSize : data.data.pageSize,
	        			currentPage : data.data.currentPage,
	        			projId : $scope.projectId,//项目Id
	        			fcCode : data.data.fcCode,//分册编号
	        			fcName : data.data.fcName,//分册名称
	        			headUserId  : data.data.headUserId , //分册负责人
	        			volumeStatus : data.data.volumeStatus, //分册状态  下拉列表
	        			schCode:$scope.schCode,
	        			projCode:$scope.projCode,
	        			schId:$scope.fcSchid
	                }
            		
                	projectService.getDesignFascicle(obj, function (data) {
                        view.schDrafts = data.data;
                        view.totalPage = data.totalPage;
                        view.pageSize = data.pageSize;
                        view.totalCount = data.totalCount; 
                        if($scope.fcSchid && data.data!=null && data.data.length > 0){
                        	$scope.$emit('to-parent-fascicle', data.data[0]);
                        }
                    }, function (error) {
                        view.showMask = false;
                        window.alert(error);
                    });
                }
                //分册类型业务字典调用
                $scope.getFenceTypeData = function getFenceTypeData(obj){
                	projectService.getProjStatus(obj, function (data) {
                		//alert(111);
                    }, function (error) {
                    });
                }

                $scope.selectProject = function(data){
    				$scope.view.selectedProject = data;
    			}
                
                $scope.switchPage = function (currentPage, pageSize) {
                    view.showMask = true;
                    data.currentPage = currentPage;
                    data.pageSize = pageSize
                    $scope.getProjectList();
                };
                
                /**
                 * 信息回调
                 */
                $scope.onSelected = function () {
                    if ($scope.onSelectedConfirm) {
                        $scope.onSelectedConfirm({
                        	draft : $scope.view.selectedProject
                        });
                        $scope.$emit('loadFascicleInfo', view.selectedProject);
                    }
                };
              //分册状态
                $scope.getFenceType = function () {
                	projectService.getProjStatus2( function (dicts) {
                		$scope.view.fenceType = dicts;
                    }, function (error) {
                        pms.alert(error);
                    });
                };
                
              //双击
    			$scope.dbSelected = function (data) {
    				$scope.view.selectedProject = data;
    				$scope.onSelected();
    			}
    			//获取人员
    			$scope.getUser = function (id,name){
                	data.data.headUserName = name; //分册负责人
        			data.data.headUserId  = id ; //分册负责人
                }
    			//打开窗口时查询
                $scope.onShow = function(){
                	$scope.getProjectList();
                	$scope.getFenceType();
                }

                //删除查询条件
              $scope.clear=function(){
                 data.data.pageSize=5;
                 data.data.currentPage=1;
                 data.data.projId="";
                 data.data.fcCode="";
                 data.data.fcName="";
                 data.data.headUserName="";
                 data.data.headUserId="";
                 data.data.volumeStatus="";
                }

            }]
        }
    }]);
    
    /**
     * 选分册外部页面 
     */
    uniformProject.directive("optionFascicleHtmlDialog", [ "contextServer", function (contextServer) {
    	
    	return {
    		restrict: "A",
    		templateUrl: contextServer + "/ct/js/tpl/fascicleInfo.jsp",
    		scope: {
    			showDialog: "=",
    			modalTitle: "@",
    			confirmButton: "@",
    			onSelectedConfirm: "&",
    			schCode:"=",
    			projectId:"=",
    			userName:"=",
    			projectData :"=",//项目信息
    			schEndTime :"=",//时间
    			fcSchid:"=",
    			fcSchIdForTimeScheduleVO:"="
    		},
    		
    		controller: ["$scope", "projectService","$filter", function ($scope, projectService,$filter) {
    			
    			//监听用户
    			$scope.$watch("userName",function(){
    				$scope.view.userName = $scope.userName;
    			})
    			$scope.$watch("fcSchIdForTimeScheduleVO",function(){
    				if($scope.fcSchIdForTimeScheduleVO){
    					$scope.view.projectData = $scope.fcSchIdForTimeScheduleVO;
    					$scope.$emit('to-parent-fascicle', $scope.fcSchIdForTimeScheduleVO);
    				}
    			})
    			
    			$scope.view = {
					fascicleDialog : false,
					projectData : {},
					userName : $scope.userName,
					projectId : $scope.projectId,//"68a62631-8329-4d16-9cca-dc1e8ed7405f"//$scope.projectId
					projectData : $scope.projectData,
					fascicle : true,
					fcSchid : $scope.fcSchid,
					resultInputTime:"",
					delayReasons:false,
					delayReason:"",
    			}
    			$scope.$watch("schEndTime",function(){
    				$scope.view.projectData.schEndTime = $scope.schEndTime
    			})
    			$scope.$watch("view.resultInputTime",function(){
    				if(toDate( $filter('date')($scope.view.projectData.schEndTime, 'yyyy-MM-dd')) < toDate($scope.view.resultInputTime)){
    					$scope.view.delayReasons = true;
    				}
    			})
    			//时间比较 $filter('date')($scope.projectVO.designDeliveryDate, 'yyyy-MM-dd')
    	        function toDate(str){
	        	    var sd=str.split("-");
	        	    return new Date(sd[0],sd[1],sd[2]);
	        	}
    			$scope.$watch("projectId",function(){
    				$scope.view.projectId = $scope.projectId;
    				getProjectList();
    			})
    			getProjectList();
    			//判断是否有分册
    			function getProjectList(){
            		var	obj = {
	        			projId : $scope.projectId,//项目Id
	                }
                	projectService.getDesignFascicle(obj, function (data) {
                        if(data.data != null && data.data.length == 0){//没有分册
                        	$scope.view.fascicle = false;
                        	//$scope.view.projectData = $scope.projectData;
                        	$scope.view.projectData.schName = $scope.projectData.projShortname
                        	$scope.view.projectData.schCode = $scope.projectData.projCode
                        	//schEndTime
                        	$scope.$emit('to-parent-fascicle', $scope.view.projectData);
                        }
                        if(data.data.length != null && data.data.length > 0){
                        	$scope.view.fascicle = true;
                        }
                    }, function (error) {
                        window.alert(error);
                    });
                }
    			
    			
    			/*$scope.$watch("fcSchid",function(){
            		var	obj = {
	        			schId:$scope.fcSchid
	                }
                	projectService.getDesignFascicle(obj, function (data) {
                		$scope.view.projectData = data.data;
                		$scope.$emit('to-parent-fascicle', data.data[0]);
                    }, function (error) {
                        view.showMask = false;
                        window.alert(error);
                    });
    			})*/
    			
    			$scope.$on('fcSchIdForTimeScheduleVO', function(event,data) {
    				$scope.view.projectData = data;
    				$scope.$emit('to-parent-fascicle', data);
    			});
    			
    			$scope.selectProject = function(draft){
    				$scope.view.projectData = draft
    				$scope.$emit('resultInputTime', $scope.view.projectData);
    				$scope.$emit('fascicle-cc', draft);
    			}
    			
    			$scope.$on('loadFascicleInfo', function(event,data) {
    				$scope.view.projectData = data;
    			});
    			$scope.$on('schEndTime', function(event,schEndTime) {
    				$scope.view.projectData.schEndTime = schEndTime;
    				
    			});
    			//监听时间
    			$scope.$watch("view.resultInputTime",function(){
    				$scope.$emit('resultInputTime', $scope.view.resultInputTime);
    			},true)
    			//监听延迟原因
    			$scope.$watch("view.delayReason",function(){
    				$scope.$emit('delayReason', $scope.view.delayReason);
    			},true)
    			
    		}]
    		
    	}
    }]);
    
    /**
     * 选择分册 selectFascicle
     */
    uniformProject.directive("selectFascicleDialog", ["contextServer", function (contextServer) {

        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/fascicleSelect.jsp",
            scope: {
                showDialog: "=",
               // mdmcode: "=",
                modalTitle: "@",
                confirmButton: "@",
                onSelectedConfirm: "&",
                projectId:"="
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
            controller: ["$scope", "projectService", function ($scope, projectService) {
            	$scope.getTime = function getTime(date){
            		var d = new Date(date);
            		return d;
            	}
                var view = {
                    totalPage: 0,           // 总页数
                    totalCount: 0,          // 总记录数
                    pageSize:5,
                    schDrafts: [] ,           // 草稿
                    selectItems:[],
	                showMask : false,
					selectedProject: null,
					selectAll:false,
		    		currentPage : 1,
		    		resultInputTime:""
                };

                var data = {
                    data: {
                    	pageSize:"5",
	        			currentPage:"1",
	        			projId:"",//项目Id
	        			fcCode:"",//分册编号
	        			fcName:"",//分册名称
	        			headUserName:"", //分册负责人
	        			volumeStatus:"" //分册状态  下拉列表
                    }
                };
                $scope.view = view;
                $scope.data = data;
                $scope.getProjectList = function getProjectList(){
            		var	obj = {
	        			pageSize : data.data.pageSize,
	        			currentPage : data.data.currentPage,
	        			projId : $scope.projectId,//项目Id
	        			fcCode : data.data.fcCode,//分册编号
	        			fcName : data.data.fcName,//分册名称
	        			headUserId  : data.data.headUserId , //分册负责人
	        			volumeStatus : data.data.volumeStatus //分册状态  下拉列表
	                }
            		
                	projectService.getDesignFascicle(obj, function (data) {
                        view.schDrafts = data.data;
                        view.totalPage = data.totalPage;
                        view.pageSize = data.pageSize;
                        view.totalCount = data.totalCount; 
                        view.showMask = false;
                    }, function (error) {
                        view.showMask = false;
                        window.alert(error);
                    });
                }
                
                /**
                 *  全选所有单据
                 */
                $scope.selectAllRecord = function () {
                	for (var i = 0;i < view.schDrafts.length;i++) {
                		view.schDrafts[i]._checked = view.selectAll;
                    }
                };
                
                /**
                 * 判断所有单据项是否被选中
                 * @returns {boolean}
                 */
                $scope.isAllSelected = function () {
                    var count = 0;
                    for (var i = 0;i < view.schDrafts.length;i++) {
                        if (view.schDrafts[i]._checked) {
                            count++;
                        }
                    }
                    return view.selectAll = (count == view.schDrafts.length);
                };
                
                /**
                 * 
                 */
                $scope.onSelected = function() {
                	var count = 0;
                	view.selectItems = [];
                	for (var i = 0;i < view.schDrafts.length;i++) {
                        if (view.schDrafts[i]._checked) {
                            count++;
                            view.selectItems.push(view.schDrafts[i]);
                        }
                    }
                	if (count < 2) {
                		alert("请选择至少两个分册！");
                		return false;
                	}
                	if ($scope.onSelectedConfirm) {
                        $scope.onSelectedConfirm({
                        	draft: view.selectItems
                        });
                        $scope.$emit('fascicleSelect', view.selectItems);
                    }
                };
                $scope.getUser = function (id,name){
                	data.data.headUserName = name; //分册负责人
        			data.data.headUserId  = id ; //分册负责人
                }
              //分册状态
                $scope.getFenceType = function () {
                	projectService.getProjStatus2( function (dicts) {
                		$scope.view.fenceType = dicts;
                    }, function (error) {
                        pms.alert(error);
                    });
                };
                
                $scope.$on('loadFascicleInfo', function(event,data) {
    				$scope.view.projectData = data;
    			});
                $scope.switchPage = function (currentPage, pageSize) {
                    view.showMask = true;
                    data.currentPage = currentPage;
                    data.pageSize = pageSize
                    $scope.getProjectList();
                };
              //打开窗口时查询
                $scope.onShow = function(){
                	$scope.getProjectList();
                	$scope.getFenceType();
                }
            }]
        }
    }]);
    
    
    
})();

