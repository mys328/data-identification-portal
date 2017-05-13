/**
 * Created by IntelliJ IDEA.
 * @author: liubo
 * @time: 17-4-19
 * @des: AngularJS 自定义指令集
 */

define(function (require, exports, module) {

    var app = angular.module('app');

    app.directive('example1', function () {
        return {
            scope: {},
            require: '^example2',
            compile: function (element, attrs) {
                return function (scope, elements, attrs, example2) {
                    example2.fn()
                };
            }
        }
    });
    app.directive('example2', function () {
        return {
            restrict: 'AE',
            scope: {},
            controller: function ($scope, $compile, $http) {
                this.fn = function () {
                    console.log('hello world.');
                };
            }
        }
    });
    app.directive("slideToggleNew", ["contextServer", function () {
        return {
            restrict: "A",
            scope: {
                refEl: "@",
                isSlide: "@" //默认收起flase,true代表默认展开
            },
            compile: function (element, attrs) {
                element.css("cursor", "pointer");
                element.css("text-decoration", "underline");
                element.css("background", "url('static/images/icon_check_down.png') no-repeat scroll 90% 50% #fff");
                element.html("展开");
                return function (scope, element, attrs) {
                    $(scope.refEl).hide();
                    element.click(function () {
                        $(scope.refEl).slideToggle();
                        if ($(this).hasClass("activi")) {
                            element.css("backgroundImage", "url('static/images/icon_check_down.png')");
                            $(this).removeClass("activi").html("展开");
                        } else {
                            element.css("backgroundImage", "url('static/images/icon_check_up.png')");
                            $(this).addClass("activi").html("收起");
                        }
                    });
                }
            }
        };
    }]);
    app.directive("pagePlugin", [function () {

        return {
            restrict: "A",
            scope: {
                totalPage: "=",
                pageSize: "=",
                currentPage: "=",
                currentPageSize: "=",
                totalCount: "=",
                onSelectPage: "&"
            },
            templateUrl: 'static/template/page-plugin.html',
            replace: true,
            controller: ["$scope", function ($scope) {
                var timeHandler;
                $scope.selectPage = function (page) {
                    var pageSize = Number($scope.pageSize);
                    if (page == undefined || page < 1) {
                        page = 1;
                    } else if (page > $scope.totalPage) {
                        page = $scope.totalPage;
                    }
                    if (((page - 1) * pageSize + 1) > $scope.totalCount) {
                        if ($scope.totalCount % pageSize == 0) {
                            $scope.currentPage = $scope.totalCount / pageSize;
                        } else {
                            $scope.currentPage = Math.floor($scope.totalCount / pageSize) + 1;
                        }
                    } else {
                        $scope.currentPage = page;
                    }
                    if ($scope.onSelectPage) {
                        $scope.onSelectPage({
                            currentPage: $scope.currentPage,
                            pageSize: $scope.pageSize
                        });
                    }
                };

                $scope.switchPage = function () {
                    if (timeHandler) {
                        window.clearTimeout(timeHandler);
                    }
                    timeHandler = window.setTimeout(function () {
                        $scope.selectPage($scope.currentPage);
                    }, 500);
                };

                $scope.$watch('currentPage', function (newValue, oldValue) {
                    if (oldValue && newValue != oldValue) {
                        if (newValue < 1 || ($scope.totalPage && newValue > $scope.totalPage)) {
                            $scope.currentPage = oldValue;
                            pms.warn("跳转页数输入错误");
                        }
                    }

                });

                $scope.selectNext = function () {
                    if (!$scope.noNext()) {
                        $scope.selectPage(Number($scope.currentPage) + 1);
                    }
                };

                $scope.noNext = function () {
                    return $scope.currentPage === $scope.totalPage;
                };

                $scope.selectPrevious = function () {
                    if (!$scope.noPrevious()) {
                        $scope.selectPage(Number($scope.currentPage) - 1);
                    }
                };

                $scope.noPrevious = function () {
                    return $scope.currentPage === 1;
                };
            }]
        };
    }]);

    app.directive("customerDialog", [function () {

        return {
            restrict: "A",
            templateUrl: "static/template/search-customer.html",
            scope: {
                showDialog: "=",
                dialogId: "@",
                sourcetype: "@",
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
            controller: ["$scope", "customerService", function ($scope, customerService) {
                var data = {
                    customer: {
                        code: "",       // 客户编号
                        name: "",       // 客户名称
                        sourcetype: $scope.sourcetype  // 数据来源source_customer为客商，source_supplier为供应商
                    },
                    pageSize: '10',       // 页尺寸
                    currentPage: 1      // 当前页号
                };

                var customerView = {
                    showMask: false,
                    totalPage: 0,           // 总页数
                    totalCount: 0,          // 总记录数
                    selectedCustomer: null,
                    customers: []           // 一页客户记录
                };

                $scope.data = data;
                $scope.customerView = customerView;

                $scope.onShow = function () {
                    if (!$scope.data.customer.sourcetype) {
                        $scope.data.customer.sourcetype = 'source_supplier';
                    }
                    $scope.searchCustomer();
                };

                $scope.onClose = function () {
                    customerView.selectedCustomer = null
                    customerView.customers = [];
                    data.customer.name = "";
                    data.customer.code = "";
//                    data.customer.type="";
                };

                //获取业务字典键值对(账户组)
                customerService.getBizDictMapNodes('ACCOUNT_TYPE', function (data) {
                    $scope.bizDictMapNodes = data;
                }, function (error) {
                    $scope.showMask = false;
                });

                /**
                 * 客户查询
                 */
                $scope.searchCustomer = function () {
                    customerView.showMask = true;
                    customerService.getCustomer($scope.data, function (customerPage) {
                        customerView.customers = customerPage.data;
                        customerView.totalCount = customerPage.totalCount;
                        customerView.totalPage = customerPage.totalPage;
                        customerView.selectedCustomer = null;
                        customerView.showMask = false;
                    }, function (error) {
                        customerView.showMask = false;
                    });
                };

                /**
                 * 翻页查询
                 * @param currentPage
                 * @param pageSize
                 */
                $scope.switchPage = function (currentPage, pageSize) {
                    if (!currentPage) {
                        currentPage = 1;
                    }
                    if (!pageSize) {
                        pageSize = 10;
                    }
                    data.pageSize = pageSize;
                    data.currentPage = currentPage;
                    $scope.searchCustomer();
                }

                /**
                 * 跟踪选择的客户
                 * @param customer
                 */
                $scope.selectCustomer = function (customer) {
                    customerView.selectedCustomer = customer;
                };

                /**
                 * 客户选择回调
                 */
                $scope.onSelected = function () {
                    if ($scope.onSelectedConfirm) {
                        $scope.onSelectedConfirm({
                            customer: customerView.selectedCustomer
                        });
                    }
                };
            }]
        }
    }]);

    app.directive("loadingAnimation", ["contextServer", function (contextServer) {
        return {
            restrict: "A",
            replace: true,
            scope: {
                visible: "=",
                refId: "@"
            },
            template: "<div><div><img src='static/images/loading.png'/></div></div>",
            compile: function (element, attrs) {
                element.css("position", "absolute");
                element.css("width", "100px");
                element.css("height", "100px");
                element.css("backgroundColor", "grey");
                element.css("opacity", "0.5");
                element.css("filter", "alpha(opacity=50)");
                element.css("display", "none");
                element.css("z-index", "1");
                return function (scope, element, attrs) {

                    var centerEl = element.children("div");
                    centerEl.css("position", "relative");
                    centerEl.css("opacity", "1");
                    centerEl.css("width", "64px");
                    centerEl.css("filter", "alpha(opacity=100)");
                    scope.$watch("visible", function (visible) {

                        element.css("display", visible ? "block" : "none");
                        var refEl = angular.element(scope.refId);
                        if (visible && refEl.size() > 0) {
                            element.width(refEl.width());
                            element.height(refEl.height());
                            element.css("top", refEl[0].offsetTop + "px");
                            element.css("left", refEl[0].offsetLeft + "px");
                            var harfH = element.height() / 2;
                            var harfW = element.width() / 2;
                            centerEl.css("top", harfH - 32 + "px");
                            centerEl.css("left", harfW - 32 + "px");
                        }
                    });
                }
            }
        };
    }]);

    app.directive("modelDialog", [function () {
        return {
            restrict: "A",
            replace: true,
            transclude: true,
            templateUrl: "static/template/modal-dialog.html",
            scope: {
                showDialog: "=",
                modalSize: "@",
                contentWidth: "@",
                modalTitle: "@",
                confirmButton: "@",
                disabledConfirm: "=",
                showFooter: "=",
                onShow: "&",
                onClose: "&",
                onConfirm: "&",
                onAsyncConfirm: "&"
            },
            compile: function (element, attrs) {
                var modalDialog = element.find(".modal-dialog");

                function adjustPosition() {
                    var marginLeft = ($(document.body).width() - modalDialog.width()) / 2;
                    modalDialog.css("marginLeft", marginLeft + "px");
                }

                return function (scope, element, attrs) {
                    scope.$watch("showDialog", function (newValue) {
                        element.modal({
                            backdrop: "static",
                            keyboard: false,
                            show: !!newValue
                        });
                    });

                    element.on("shown.bs.modal", function (e) {
                        if (window.attachEvent) {
                            adjustPosition();
                            window.attachEvent("onresize", adjustPosition);
                        }
                        if (scope.onShow) {
                            scope.onShow();
                        }
                    });
                    element.on("hidden.bs.modal", function (e) {
                        if (window.detachEvent) {
                            window.detachEvent("onresize", adjustPosition);
                        }
                        try {
                            scope.$apply(function () {
                                scope.showDialog = false;
                            });
                        } finally {
                            scope.showDialog = false;
                        }
                        if (scope.onClose) {
                            scope.onClose();
                        }
                    });

                    element.find(".modal-footer button").click(function () {
                        if (scope.onConfirm) {
                            scope.onConfirm();
                        }
                        element.modal("hide");
                    });

                    element.find(".modal-body .confirm-button").click(function () {
                        if (attrs.onConfirm) {
                            scope.onConfirm();
                            element.modal("hide");
                        } else if (attrs.onAsyncConfirm) {
                            scope.onAsyncConfirm({
                                success: function () {
                                    element.modal("hide");
                                }
                            });
                        }
                    });

                    element.find(".modal-body .close-button").click(function () {
                        element.modal("hide");
                    });
                };
            }
        };
    }]);



    app.factory("uploadFileService", ["$http", '$q', "contextServer", function ($http, $q, contextServer) {


        /**
         * 上传成功
         */
        function uploadSuccess(confId,docId, callback, errorCallback) {
            $http.jsonp(contextServer + "/fss/paas/fss/attach/update.do?callback=JSON_CALLBACK"
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
         * 修改或详情时根据业务主键ID请求相关的附件集合
         */
        function getFilesList(queryObj, callback, errorCallback) {
            $http.jsonp(contextServer + "/fss/paas/fss/attach/getAttListByBisId.do?callback=JSON_CALLBACK"
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
            uploadSuccess: function (confId,docId, callback, errorCallback) {
                uploadSuccess(confId,docId, callback, errorCallback);
            },
            getFilesList: function (queryObj, callback, errorCallback) {
                getFilesList(queryObj, callback, errorCallback);
            }
        };
    }]);

    app.directive("fileUpload", ["contextServer", function (contextServer) {

        return {
            restrict: "A",
            templateUrl: "static/template/fileUpload.html",
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
                    uploadUrl: contextServer + '/',	//上传地址
                    proxy: $scope.proxy		//上传地址
                }


                $scope.view = {
                    projectDocs : []
                };

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
});

