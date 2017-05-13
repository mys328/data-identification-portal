(function(){

    var r = {
        protocol: /([^\/]+:)\/\/(.*)/i,
        host: /(^[^\:\/]+)((?:\/|:|$)?.*)/,
        port: /\:?([^\/]*)(\/?.*)/,
        pathname: /([^\?#]+)(\??[^#]*)(#?.*)/
    };

    function parseUrl(url) {
        var tmp, res = {};
        res["href"] = url;
            for (p in r) {
                tmp = r[p].exec(url);
                res[p] = tmp[1];
                url = tmp[2];
                if (url === "") {
                    url = "/";
                }
                if (p === "pathname") {
                    res["pathname"] = tmp[1];
                    res["search"] = tmp[2];
                    res["hash"] = tmp[3];
                }
            }
        return res;
    };

    var head = document.getElementsByTagName("head")[0];
    var scriptList = head.getElementsByTagName("script");

    var url = parseUrl(scriptList[scriptList.length - 1].src);
    var contextServer = url.protocol + "//" + url.host;
    if(url.port){
    	contextServer += ":" + url.port;
    }
   
    var uniformCmp = angular.module("uniformModule", []);
    uniformCmp.config(function ($sceDelegateProvider, $httpProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
//            url.protocol + "//" + url.host + ":" + url.port + "/**"
            contextServer  + "/**"
        ]);
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });
    
    uniformCmp.constant("contextServer", contextServer);


    uniformCmp.factory("uniformService", ["$http", function ($http) {

        function getByNodeKey(nodeKey, callback, errorCallback) {
            $http.jsonp(contextServer + "/ct/paas/ct/resource/getByNodeKey.do?callback=JSON_CALLBACK", {
                params: {
                    nodeKey: nodeKey
                }
            }).success(function (result) {
                if (callback) {
                    callback(result);
                }
            }).error(errorCallback);
        };
        
        function getTaxTypeInfo(callback, errorCallback) {
            $http.jsonp(contextServer + "/ct/paas/ct/resource/getTaxInfo.do?callback=JSON_CALLBACK&pageSize=9999").success(function (result) {
                if (callback) {
                    callback(result);
                }
            }).error(errorCallback);
        };
        
        return {
            getByNodeKey: function (nodeKey, callback, errorCallback) {
                getByNodeKey(nodeKey, callback, errorCallback);
            },
            getTaxTypeInfo: function (callback, errorCallback) {
            	getTaxTypeInfo(callback, errorCallback);
            }
        };
    }]);

    uniformCmp.directive("modalDialog", [function () {
        return {
            restrict: "A",
            replace: true,
            transclude: true,
            templateUrl: contextServer + "/ct/js/tpl/modalDialog.jsp",
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
                onAsyncConfirm : "&"
            },
            compile: function(element, attrs) {
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
                        if($('body').find(".modal.fade.in").length > 0){
                        	$('body').addClass("modal-open");
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
                        } else if(attrs.onAsyncConfirm) {
                            scope.onAsyncConfirm({
                                success: function () {
                                    element.modal("hide");
                                }
                            });
                        }
                    });
                    //关闭按钮
                    element.find(".modal-body .close-button").click(function () {
                        element.modal("hide");
                    });
                };
            }
        };
    }]);

    uniformCmp.directive("pagination", [function () {

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
            templateUrl : contextServer + "/ct/js/tpl/pagination.jsp",
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
                    if (((page - 1) *pageSize + 1) > $scope.totalCount) {
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
                }
                
                $scope.$watch('currentPage',function(newValue,oldValue){
                	if (oldValue && newValue != oldValue) {
                		if(newValue < 1 || ($scope.totalPage && newValue > $scope.totalPage)) {
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


    uniformCmp.directive("mask", ["contextServer", function (contextServer) {
        return {
            restrict: "A",
            replace: true,
            scope: {
                visible: "=",
                refId: "@"
            },
            template: "<div><div><img src='" + contextServer + "/ct/img/loading.png'/></div></div>",
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
                    scope.$watch("visible", function(visible){

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
                            centerEl.css("left", harfW - 32  + "px");
                        }
                    });
                }
            }
        };
    }]);

    uniformCmp.directive("slideToggle", ["contextServer", function () {

        return {
            restrict: "A",
            scope: {
                refEl: "@",
                isSlide: "@" //默认收起flase,true代表默认展开
            },
            compile: function (element, attrs) {

                element.css("cursor", "pointer");
                element.css("text-decoration", "underline");
                element.css("background", "url('"+ contextServer +"/ct/img/icon_check_down.png') no-repeat scroll 90% 50% #fff");
                element.html("展开");
                return function (scope, element, attrs) {
                	$(scope.refEl).hide();
                    element.click(function () {
                        $(scope.refEl).slideToggle();
                        if ($(this).hasClass("activi")) {
                            element.css("backgroundImage", "url('"+ contextServer +"/ct/img/icon_check_down.png')");
                            $(this).removeClass("activi").html("展开");
                        } else {
                            element.css("backgroundImage", "url('"+ contextServer +"/ct/img/icon_check_up.png')");
                            $(this).addClass("activi").html("收起");
                        }
                    });
                }
            }
        };
    }]);
    /*
     *[“展开”-“收起”] 幻灯片切换指令：  默认展开
     */
    uniformCmp.directive("slideToggleShow", ["contextServer", function () {

        return {
            restrict: "A",
            scope: {
                refEl: "@"
            },
            compile: function (element, attrs) {

                element.css("cursor", "pointer");
                element.css("text-decoration", "underline");
                element.css("background", "url('"+ contextServer +"/ct/img/icon_check_up.png') no-repeat scroll 90% 50% rgba(255, 255, 255, 0)");
                element.addClass("activi").html("收起");
                return function (scope, element, attrs) {
                	console.log(scope.refEl);
                	//$(scope.refEl).hide();
                    element.click(function () {
                        $(scope.refEl).slideToggle();
                        if ($(this).hasClass("activi")) {
                            element.css("backgroundImage", "url('"+ contextServer +"/ct/img/icon_check_down.png')");
                            $(this).removeClass("activi").html("展开");
                        } else {
                            element.css("backgroundImage", "url('"+ contextServer +"/ct/img/icon_check_up.png')");
                            $(this).addClass("activi").html("收起");
                        }
                    });
                }
            }
        };
    }]);
    uniformCmp.directive("datePicker", [function () {
        return {
            restrict: "A",
            require: "?ngModel",
            link: function(scope, element, attrs, ngModelCtrl) {
                element.blur(function(){
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(element.val());
                    });
                });
                
                element.focus(function () {
                    var params;
                    try {
                        params = eval("(" + attrs.datePicker + ")");
                        if (!params.dateFmt) {
                            params.dateFmt = "yyyy-MM-dd";
                        }
                    } catch (e) {
                        params = {dateFmt:'yyyy-MM-dd'};
                    }
                    WdatePicker(params);
                });
            }
        }
    }]);
    uniformCmp.directive("dateShow", [function () {
    	return {
    		restrict: "A",
    		link: function(scope, element, attrs) {
    			element.click(function(){
    				element.prev().focus();
    			});
    		}
    	};
    }]);
    uniformCmp.directive("number", [function () {
        return {
            restrict: "A",
            require: "?ngModel",
            compile: function (element, attrs) {
                var accKeys = [8, 39, 37, 190];
                element.keydown(function (e) {
                    if ((e.keyCode >= 48 && e.keyCode <= 57) || accKeys.indexOf(e.keyCode) != -1) {
                        if (e.keyCode == 190) {
                            console.log(element.val());
                            if (element.val() == "" || element.val().indexOf(".") != -1) {
                                return false;
                            }
                        }
                        return true;
                    } else {
                        return false;
                    };
                });
                return function (scope, element, attrs, ngModelCtrl) {
                    element.bind("paste", function (e) {
                        var oldValue = element.val();
                        setTimeout(function () {
                            if (element.val() == "") {
                                element.val(oldValue);
                                scope.$apply(function () {
                                    ngModelCtrl.$setViewValue(element.val());
                                });
                            }
                        }, 1);
                        return true;
                    });
                }
            }
        };
    }]);

    uniformCmp.filter("numberStringFormat", function () {
        return function (value) {
            var result = [];
            var n = 0;
            var integer = value.split(".")[0];
            var decimals = value.split(".")[1];

            for (var i = integer.length - 1;i >= 0;i--) {
                if (n % 3 == 0 && n > 0) {
                    result.unshift(",");
                }
                result.unshift(integer.charAt(i));
                n++;
            }
            return result.join("") + (decimals ? "." + decimals : "");
        }
    });

    uniformCmp.filter('cutStr', function() {
    	/*
    	 * value : 过滤字段值
    	 * max : 截取长度
    	 * tail ： 字符串最后保留字符串,默认'...'
    	 * */
    	return function(value,max, tail) {
    		if (!value) return '';
    		max = parseInt(max, 10);
    		if (!max) return value;
    		if (value.length <= max) return value;
    		value = value.substr(0, max);
    		return value + (tail || '…');
    	};
    });   
    //My97DatePicker日期插件更新model
    uniformCmp.directive("updateTime", [function () {
        return {
            restrict: "A",
            require: "?ngModel",
            link: function(scope, element, attrs, ngModelCtrl) {
                element.blur(function(){
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(element.val());
                    });
                });
            }
        }
    }]);

    uniformCmp.directive("uploadFile", function () {
        return {
            restrict: "AE",
            replace: true,
            template: "<form style='position: relative'><span class='btn-choose'><a class='btn btn-default' href=''><i class='fa fa-folder-open'></i> 浏 览</a></span></form>",
            scope: {
                basePath: "=",
                proxy: "=",
                systemCode: "=",
                onUploaded: "&"
            },
            compile: function (element, attrs) {
                return function (scope, element, attrs) {
            		element.children().children("a")[0].click();
            		
                    $.bindFileUploadEvent({
                        uploadAttachment: element.children().children("a"),
                        basePath: scope.basePath,
                        attachmentSystemCode: scope.systemCode,
                        proxy: scope.proxy,
                        callBackFunc: function (uploadData) {
                            scope.$apply(function () {
                                scope.onUploaded({uploadData: uploadData});
                            });
                        }
                    });
                }
            }
        };
    });
    
    /**
     * 批量导入行-excel
     */
    uniformCmp.directive("bulkImport", function () {
        return {
            restrict: "AE",
            replace: true,
            template: "<form style='position: relative'><span class='btn-choose'><a class='btn btn-default' href=''><i class='fa fa-folder-open'></i> 批量导入</a></span></form>",
            scope: {
                uploadUrl: "=",
                fileId: "=",
                onUploaded: "&"
            },
            compile: function (element, attrs) {
                return function (scope, element, attrs) {
            		element.children().children("a")[0].click();
            		var fileId = scope.fileId;
            		var uploadAttachment = element.children().children("a");
            		var count = -1;
            		
                    //添加上传按钮
            		function addFileInput(){
                        $("#" + fileId).remove();
            			count++;
                        var html = $('<input type="file" title="' + count + '" id="' + fileId + '" name="' + fileId + '" style="position:absolute;filter:alpha(opacity=0);cursor: pointer; z-index:9999;width:0px;" />');
                        uploadAttachment.after(html);
                        uploadAttachment.css("z-index", "-1");
                        
                        $("#" + fileId).css("opacity", "100");
                        $("#" + fileId).css('top', "3px");
                        $("#" + fileId).css('left', "-103px");
                        $("#" + fileId).css("width", uploadAttachment[0].offsetWidth + "px");
                        $("#" + fileId).css("height", uploadAttachment[0].offsetHeight + "px");
                        bindFileInputChangeEvent();
                    }
            		
            		//给按钮添加绑定事件
            		function bindFileInputChangeEvent(){
                        $("#" + fileId).unbind("change");
                        $("#" + fileId).bind("change", function(){
                            //显示遮罩
//                            $(".add_file").showLoading();
                        	$.ajaxFileUpload({
                                url: scope.uploadUrl,
                                secureuri:false,
                                fileElementId: fileId,
                                dataType: 'json',
                                success:function (data, status){
                                    try{
                                        alert("11");
                                        if(scope.onUploaded){
                                        	scope.onUploaded({list: data});
                                        }
                                        //错误异常处理
                                    }finally{
                                        addFileInput();
                                        //去除遮罩
//                                        $(".add_file").hideLoading();
                                    }
                                },
                                error:function(e){
                                    alert('上传异常请联系管理员!');
                                    addFileInput();
                                    //去除遮罩
//                                    $(".add_file").hideLoading();
                                    if(scope.onUploaded){
                                    	scope.onUploaded({list: data});
                                    }

                                }
                            });
                            
                        });
            			
                    }
            		
            		addFileInput();
                }
            }
        };
    });
    
    uniformCmp.directive("iframe", function () {
        return {
            restrict: "E",
            replace: true,
            scope: {
                bindSrc: "="
            },
            compile: function (element, attrs) {
                return function (scope, element, attrs) {
                    scope.$watch("bindSrc", function () {
                        element.attr("src", scope.bindSrc);
                    });
                }
            }
        };
    });
    
    //展开收起
    uniformCmp.directive("slideToggles", [function () {
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
    //正数金额
    uniformCmp.directive('posAmounts',function (){
        return{
            restrict: "A",
            require: "?ngModel",
            link: function(scope, element, attrs, ngModelCtrl){
                element.blur(function() {
                    var reg = /^(([1-9]\d*)|0)(\.\d{1,2})?$/;
                    var value = element.val().replace(/,/g,'');
                    value = value.replace(/\s+/g,"");
                    if(reg.test(value)){
                        ngModelCtrl.$setViewValue(parseFloat(value).toFixed(2));
                        element.val(parseFloat(value).toFixed(2));
                        scope.$apply();
                    }else if(value==""){
                        ngModelCtrl.$setViewValue(0.00.toFixed(2));
                        element.val(0.00.toFixed(2));
                        scope.$apply();
                    }else{
                        pms.warn("请输入正确的金额!");
                        ngModelCtrl.$setViewValue(0.00.toFixed(2));
                        element.val(0.00.toFixed(2));
                        scope.$apply();
                    }
                });
            }
        }
    });
    //正负金额
    uniformCmp.directive('amounts',function (){
        return{
            restrict: "A",
            require: "?ngModel",
            link: function(scope, element, attrs, ngModelCtrl){
                element.blur(function() {
                    var reg = /^[+-]?\d*\.?\d{1,2}$/;
                    var value = element.val().replace(/,/g,'');
                    value = value.replace(/\s+/g,"");
                    if(reg.test(value)){
                        ngModelCtrl.$setViewValue(parseFloat(value).toFixed(2));
                        element.val(parseFloat(value).toFixed(2));
                        scope.$apply();
                    }else if(value==""){
                        ngModelCtrl.$setViewValue(0.00.toFixed(2));
                        element.val(0.00.toFixed(2));
                        scope.$apply();
                    }else{
                        pms.warn("请输入正确的金额!");
                        ngModelCtrl.$setViewValue(0.00.toFixed(2));
                        element.val(0.00.toFixed(2));
                        scope.$apply();
                    }
                });
            }
        }
    });
    //负金额
    uniformCmp.directive('ngtAmounts',function (){
        return{
            restrict: "A",
            require: "?ngModel",
            link: function(scope, element, attrs, ngModelCtrl){
                element.blur(function() {
                    var reg = /^[-]\d*\.?\d{1,2}$/;
                    var value = element.val().replace(/,/g,'');
                    value = value.replace(/\s+/g,"");
                    if(reg.test(value)){
                        ngModelCtrl.$setViewValue(parseFloat(value).toFixed(2));
                        element.val(parseFloat(value).toFixed(2));
                        scope.$apply();
                    }else if(value==""){
                        ngModelCtrl.$setViewValue(0.00.toFixed(2));
                        element.val(0.00.toFixed(2));
                        scope.$apply();
                    }else{
                        pms.warn("请输入正确的金额!");
                        ngModelCtrl.$setViewValue(0.00.toFixed(2));
                        element.val(0.00.toFixed(2));
                        scope.$apply();
                    }
                });
            }
        }
    });
    //正整数和零
    uniformCmp.directive('num',function () {
        return{
            restrict: "A",
            require: "?ngModel",
            link: function(scope, element, attrs, ngModelCtrl){
                element.blur(function() {
                	var reg= /^(0|[1-9][0-9]*)$/;
                	var value = element.val().replace(/,/g,'');
                	value = value.replace(/\s+/g,"");
                    if(reg.test(value)){
                        ngModelCtrl.$setViewValue(value);
                        element.val(value);
                        scope.$apply();
                    }else if(value==""){
                        ngModelCtrl.$setViewValue(0);
                        element.val(0);
                        scope.$apply();
                    }else{
                        pms.alert("请输入正确的数目!");
                        ngModelCtrl.$setViewValue(0);
                        element.val(0);
                        scope.$apply();
                    }
                });
            }
        }
    });
    //正汇率和0
    uniformCmp.directive('exchangeRate',function (){
        return{
            restrict: "A",
            require: "?ngModel",
            link: function(scope, element, attrs, ngModelCtrl){
                element.blur(function() {
                    var reg = /^(([1-9]\d*)|0)(\.\d{1,5})?$/;
                    if(reg.test(element.val())){
                        ngModelCtrl.$setViewValue(parseFloat(element.val()).toFixed(5));
                        element.val(parseFloat(element.val()).toFixed(5));
                        scope.$apply();
                    }else if(element.val()==""){
                        ngModelCtrl.$setViewValue(0.00.toFixed(5));
                        element.val(0.00.toFixed(5));
                        scope.$apply();
                    }else{
                        pms.alert("请输入正确的汇率!");
                        ngModelCtrl.$setViewValue(0.00.toFixed(5));
                        element.val(0.00.toFixed(5));
                        scope.$apply();
                    }
                });
            }
        }
    });
    
    // 邮政编码验证    
    uniformCmp.directive('ngIsZipcode',function (){
        return{
            restrict: "A",
            require: "?ngModel",
            link: function(scope, element, attrs, ngModelCtrl){
                element.blur(function() {
                    var reg =/^[0-9]{6}$/;
                    var value = element.val().replace(/,/g,'');
                    if(reg.test(value)){
                        ngModelCtrl.$setViewValue(value);
                        element.val(value);
                        scope.$apply();
                    }else if(value==""){
                        ngModelCtrl.$setViewValue("");
                        element.val("");
                        scope.$apply();
                    }else{
                        pms.warn("请正确填写您的邮政编码!");
                        ngModelCtrl.$setViewValue("");
                        element.val("");
                        scope.$apply();
                    }
                });
            }
        }
    });
    
    // 电话号码   
    uniformCmp.directive('ngIsPhone',function (){
        return{
            restrict: "A",
            require: "?ngModel",
            link: function(scope, element, attrs, ngModelCtrl){
                element.blur(function() {
                    var reg = /^(\d{3,4}-?)?\d{7,9}$/g;
                    var value = element.val().replace(/,/g,'');
                    if(reg.test(value)){
                        ngModelCtrl.$setViewValue(value);
                        element.val(value);
                        scope.$apply();
                    }else if(value==""){
                        ngModelCtrl.$setViewValue("");
                        element.val("");
                        scope.$apply();
                    }else{
                        pms.warn("请正确填写您的电话号码!");
                        ngModelCtrl.$setViewValue("");
                        element.val("");
                        scope.$apply();
                    }
                });
            }
        }
    });
    
    // 电子邮箱验证
    uniformCmp.directive('ngIsEmail',function (){
        return{
            restrict: "A",
            require: "?ngModel",
            link: function(scope, element, attrs, ngModelCtrl){
                element.blur(function() {
                    var reg = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
                    var value = element.val().replace(/,/g,'');
                    if(reg.test(value)){
                        ngModelCtrl.$setViewValue(value);
                        element.val(value);
                        scope.$apply();
                    }else if(value==""){
                        ngModelCtrl.$setViewValue("");
                        element.val("");
                        scope.$apply();
                    }else{
                        pms.warn("请正确填写您的电子邮箱!");
                        ngModelCtrl.$setViewValue("");
                        element.val("");
                        scope.$apply();
                    }
                });
            }
        }
    });
    
    // 传真号验证
    uniformCmp.directive('ngIsFax',function (){
        return{
            restrict: "A",
            require: "?ngModel",
            link: function(scope, element, attrs, ngModelCtrl){
                element.blur(function() {
                    var reg = /^(\d{3,4}-?)?\d{7,9}$/g;
                    var value = element.val().replace(/,/g,'');
                    if(reg.test(value)){
                        ngModelCtrl.$setViewValue(value);
                        element.val(value);
                        scope.$apply();
                    }else if(value==""){
                        ngModelCtrl.$setViewValue("");
                        element.val("");
                        scope.$apply();
                    }else{
                        pms.warn("请正确填写您的传真号!");
                        ngModelCtrl.$setViewValue("");
                        element.val("");
                        scope.$apply();
                    }
                });
            }
        }
    });
})();

