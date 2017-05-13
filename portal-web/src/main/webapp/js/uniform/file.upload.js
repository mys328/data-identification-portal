(function(){
    var uniformFileUpload = angular.module("uniformFileUpload", ["uniformModule"]);
    uniformFileUpload.factory("uploadFileService", ["$http", '$q', "contextServer", function ($http, $q, contextServer) {

    	/**
    	 * 初始化请求下拉框集合
    	 */
        function initDoc(activityType, callback, errorCallback) {
        	$http.jsonp(contextServer + "/ct/pass/ct/attTypeVo/getAttTypeVoList.do?callback=JSON_CALLBACK"
               , {
                params: {
                    activityType: activityType          //系统编码
                }
            }
            ).success(function (result) {
                if (callback) {
                    callback(result);
                }
            }).error(errorCallback);
        };
        
        /**
         * 上传成功
         */
        function uploadSuccess(confId,docId, callback, errorCallback) {
	      	$http.jsonp(contextServer + "/ct/paas/ct/attInst/update.do?callback=JSON_CALLBACK"
	             , {
	              params: {
	            	  confId: confId,          //下拉选ID
	                  docId:docId              //文件ID
	              }
	          }
	          ).success(function (result) {
	              if (callback) {
	                  callback(result);
	              }
	          }).error(errorCallback);
        };
      
	      /**
	       * 校验--判断附件集合是否符合必填验证
	       */
	      function isCheck(docList,activityType, callback, errorCallback) {
	    	  	var deferred = $q.defer(); 
				$http.jsonp(contextServer + "/ct/paas/ct/attInst/attValidate.do?callback=JSON_CALLBACK", {
                        params: {
                            docList: angular.toJson(docList),          		//附件集合
                            activityType:activityType             		    //公司编号$scope.systemCode
                        }
                    }
			    ).success(function (result) {
                    if (callback) {
                        callback(result);
                    }
			    	deferred.resolve(result);		                        // 声明执行成功
		        }).error(function(error, status, headers, config) {
		            deferred.reject(error.errorMessage);   	                // 声明执行失败，服务器返回错误
		        });
				return deferred.promise;
	      };
      
      	/**
	  	 * 修改或详情时根据业务主键ID请求相关的附件集合
	  	 */
	      function getFilesList(queryObj, callback, errorCallback) {
	      	$http.jsonp(contextServer + "/ct/paas/ct/attInst/getAttListByBisId.do?callback=JSON_CALLBACK"
	             , {
	              params: {
	            	  bisId: queryObj.systemCode,          	//业务ID
	            	  bizNum: queryObj.primaryKeys			//活动编码
	              }
	          }
	          ).success(function (result) {
	              if (callback) {
	                  callback(result);
	              }
	          }).error(errorCallback);
	      };

        return {
            initDoc: function (activityType, callback, errorCallback) {
                initDoc(activityType, callback, errorCallback);
            },
	        uploadSuccess: function (confId,docId, callback, errorCallback) {
	        	uploadSuccess(confId,docId, callback, errorCallback);
	        },
            isCheck: function (docList,activityType, callback, errorCallback) {
            	return isCheck(docList,activityType, callback, errorCallback);
	        },
	        getFilesList: function (queryObj, callback, errorCallback) {
	        	getFilesList(queryObj, callback, errorCallback);
	        }
        };
    }]);

    uniformFileUpload.directive("fileUpload", ["contextServer", function (contextServer) {

        return {
            restrict: "A",
            templateUrl: contextServer + "/ct/js/tpl/file.upload.jsp",
            scope: {
            	primaryKeys: "=",
                systemCode: "=",
                proxy: "=",
                mode: "=",
                tempList: "=",  //当附件在列上的弹出框时，传递此值以此回显
                onlyOne: "@",	//只允许上传一个附件当为true时
                onSelectedConfirm: "&"
            },
            controller: ["$scope", "uploadFileService","$timeout", function ($scope, uploadFileService, $timeout) {
                $scope.showView = {
                    showMask: false,//是否等待
                    activityType:$scope.systemCode,		//$scope.systemCode, //公司编号1404
                    uploadUrl: contextServer + '/ct',	//上传地址
                    proxy: $scope.proxy		//上传地址
                }


                $scope.view = {
                    projectDocs : []
                };

                /**
                 * 附件功能--附件类型查询
                 */
                function initDoc(){
                    $scope.showView.showMask=true;
                    uploadFileService.initDoc($scope.showView.activityType,function(data){
                    	if(!(data && data.length > 0)){
                    		pms.alert('请联系管理员配置附件类型！');
                    		return;
                    	}
                    	$scope.showView.docType=data;   //后台返回的下拉选的数据
                    	
                    	var num  = 0;
                    	//在新增页面下，判断当前是否是必填项,如果是则至少添加1条必填附件集合
                    	if($scope.mode == 'add'){
                    		for(var i = 0 ; i < data.length ; i++){
                    			if(data[i].isMust == 1){
                    				 $scope.view.projectDocs.push({
                                         docId: "",//附件ID
                                         docName: "",//附件名称
                                         confId:data[i].typeInstId,//下拉框id--配置表id
                                         docConfigName:"",//下拉框名称--活动附件配置名称
                                         isRequired:1,//是否必填 1是2否
                                         attPath:"",//下载路径
                                         type:""//0是FTP附件1是fastDfs附件
                                     });
                    				 num += 1;
                    			}
                    		}
                    		
                    		if((num == 0) && ($scope.view.projectDocs.length == 0)){
                    			$scope.view.projectDocs.push({
                                    docId: "",//附件ID
                                    docName: "",//附件名称
                                    confId:"",//下拉框id--配置表id
                                    docConfigName:"",//下拉框名称--活动附件配置名称
                                    isRequired:"",//是否必填 1是2否
                                    attPath:"",//下载路径
                                    type:""//0是FTP附件1是fastDfs附件
                                });
                    		}
                    	}else if($scope.mode == 'modify'){
                    		if($scope.onlyOne == 'true' && !($scope.view.projectDocs && $scope.view.projectDocs.length.length > 0)){
                    			$scope.view.projectDocs.push({
                                    docId: "",//附件ID
                                    docName: "",//附件名称
                                    confId:"",//下拉框id--配置表id
                                    docConfigName:"",//下拉框名称--活动附件配置名称
                                    isRequired:"",//是否必填 1是2否
                                    attPath:"",//下载路径
                                    type:""//0是FTP附件1是fastDfs附件	
                                });
                    		}
                    	}
                    });
                }
                
                initDoc();
                
                $scope.$watch('primaryKeys', function(value){
                    if(value){
                    	//请求附件集合
                    	var queryObj = {
                    			primaryKeys: $scope.primaryKeys,
                    			systemCode: $scope.systemCode
                    	}
                		uploadFileService.getFilesList(queryObj, function(data){
                			if(!data || !(data && data.length > 0)){
                				if($scope.mode != 'view'){
                					data = [{
                                        docId: "",//附件ID
                                        docName: "",//附件名称
                                        confId:"",//下拉框id--配置表id
                                        docConfigName:"",//下拉框名称--活动附件配置名称
                                        isRequired:"",//是否必填 1是2否
                                        attPath:"",//下载路径
                                        type:""//0是FTP附件1是fastDfs附件
                                    }];
                				}else{
                					data = [];
                				}
                			}
                			
                			$scope.view.projectDocs = data;
                			$scope.paramsList = data;
                			if($scope.onSelected){
            					$scope.onSelected();
            				}
                		});
                    }
                })

                $scope.$watch('tempList', function(value){
                    if(value && value.length > 0){
                        $scope.view.projectDocs = value;
                    }
                })
                
                /**
                 * 监听附件数量变化yy
                 */
                 $scope.$watch('view.projectDocs', function(value){
                    if(value && value.length > 0){
                        $scope.paramsList = value;
                        $scope.onSelected();
                    }
                },true)                //$watch第三个参数true表示监听对象里的值 false是监听当前对象 默认是false

                /**
                 * 是否可以修改附件信息
                 */
                $scope.getIsModifyFile = function () {
                    if($scope.mode != 'view'){
                        return true;
                    }
                    return false;
                }

                /**
                 * 附件功能--添加附件--添加按钮
                 */
                $scope.addUpload = function () {
                    $scope.view.projectDocs.push({
//                        pdocId: "",//主键
                        docId: "",//附件ID
//                        projId: $scope.view.projId,//项目ID
//                        projStage: "",//阶段编码?
//                        docSource: "",//文档来源?
                        docName: "",//附件名称
                        confId:"",//下拉框id--配置表id
                        docConfigName:"",//下拉框名称--活动附件配置名称
                        isRequired:"",//是否必填 1是2否
                        type:""//0是FTP附件1是fastDfs附件
                    });
                };

                $scope.onUpload = function (data) {

                };

                /**
                 * 附件功能--删除附件--删除按钮
                 */
                $scope.removeUpload = function (index) {
                	var fileObj = $scope.view.projectDocs[index];
                    $scope.view.projectDocs.splice(index, 1);
                    var flag = delValid(fileObj);
                    
                    if(!($scope.view.projectDocs && $scope.view.projectDocs.length > 0) && !flag){
                        $scope.view.projectDocs = [];
                        $scope.view.projectDocs.push({
                            docId: "",//附件ID
                            docName: "",//附件名称
                            confId:"",//下拉框id--配置表id
                            docConfigName:"",//下拉框名称--活动附件配置名称
                            isRequired:"",//是否必填 1是2否
                            type:""//0是FTP附件1是fastDfs附件
                        });
                    }
                };
                
                /**
                 * 判断删除的是否是必填项，如果是则判断集合中是否存在此类必填项，不存在则添加一个此类必填项的空对象
                 */
                var delValid = function(fileObj){
                	var isRequired = $scope.getMandatory(fileObj);
                	if(isRequired){
                		var flag = false;//是否存在2个或以上的必填项
                		angular.forEach($scope.view.projectDocs, function(item){
                			if(item.confId == fileObj.confId){
                				flag = true;
                			}
                		});
                	
	                	if(!flag){
	                		$scope.view.projectDocs.push({
	                            docId: "",//附件ID
	                            docName: "",//附件名称
	                            confId: fileObj.confId,//下拉框id--配置表id
	                            docConfigName:"",//下拉框名称--活动附件配置名称
	                            isRequired:fileObj.isRequired//是否必填 1是2否
	                        });
	                	}
                	}
                	return isRequired;
                }

                /**
                 * 附件功能--上传成功回调函数
                 */
                $scope.setUploadItem = function (uploadItem, uploadData) {
//                    uploadItem.docName = uploadData.attachmentName+"."+uploadData.attachmentType;
                	uploadItem.docName = uploadData.attachmentName;
                    uploadItem.docId = uploadData.attachmentId;
                    uploadItem.attPath=uploadData.attPath;
                    uploadItem.type =uploadData.type;
                    //上传成功回调
                    uploadFileService.uploadSuccess(uploadItem.confId,uploadItem.docId,function(data){
                    	//alert(data);
                    });
                };
                //--附件功能--//
                
                /**
                 * 根据选中的下拉框值判断是否必填
                 * @return boolean
                 */
                $scope.getMandatory = function(currItem) {
                	var flag = false;
                	angular.forEach($scope.showView.docType, function(item){
                		if(item.typeInstId == currItem.confId){
                			if(item.isMust == 1){
                				currItem.isRequired = 1;
                				currItem.docConfigName = item.typeName;
                				flag = true;
                			}else {
                				currItem.isRequired = 0;
                				currItem.docConfigName = item.typeName;
                			}
                		}
                	});
                	return flag;
                }

                /**
                 * 回调函数
                 */
                $scope.onSelected = function () {
                    if ($scope.onSelectedConfirm) {
                        $scope.onSelectedConfirm({
                            filesList: $scope.paramsList
                        });
                    }
                };
                

            }]
        };
    }]);
    
})();