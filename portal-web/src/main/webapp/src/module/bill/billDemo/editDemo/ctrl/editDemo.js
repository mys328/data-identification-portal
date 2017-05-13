/**
 * Created by IntelliJ IDEA.
 * @author: liubo
 * @time: 17-4-20
 * @des:
 */
define(function (require, exports, module) {

    module.exports = function (app) {

        app.service("contactMgrService", ["$http", function ($http) {
            function saveInitProve(initProve, callback, errorCallback) {
                $http.post("/crm/paas/crm/contactsInfo/saveSubmit.do", initProve).success(function (result) {
                    if (callback) {
                        callback(result);
                    }
                }).error(errorCallback);
            }

            function selInfo(callback, errorCallback) {
                var data = {data: "2015-10-30", userId: "00001", userName: "何俊"};
                return data;
            }

            function searchInitProveList(queryObj, callback, errorCallback) {
                $http.post("/crm/paas/crm/contactsInfo/list.do", {
                    pageSize: queryObj.pageSize,
                    currentPage: queryObj.currentPage,
                    data: queryObj.data
                }).success(function (result) {    // 成功回调函数， result为标准的pageBean格式json对象
                    if (callback) {
                        callback(result);
                    }
                }).error(errorCallback);
            }


            function queryInitProveById(contactsId, callback, errorCallback) {
                $http.get("/crm/paas/crm/contactsInfo/updateNew.do", {
                    params: {
                        contactsId: contactsId
                    }
                }).success(function (result) {
                    if (callback) {
                        callback(result);
                    }
                }).error(errorCallback);
            }

            function delData(contactsInfoIds, callback, errorCallback) {
                $http.post("/crm/paas/crm/contactsInfo/del.do", angular.toJson(contactsInfoIds)
                ).success(function (result) {
                    if (callback) {
                        callback(result);
                    }
                }).error(errorCallback);
            }

            return {
                delData: function (contactsInfoIds, callback, errorCallback) {
                    delData(contactsInfoIds, callback, errorCallback);
                },
                saveInitProve: function (initProve, callback, errorCallback) {
                    saveInitProve(initProve, callback, errorCallback);
                },
                selInfo: function (callback, errorCallback) {
                    selInfo(callback, errorCallback);
                },
                searchInitProveList: function (queryObj, callback, errorCallback) {
                    searchInitProveList(queryObj, callback, errorCallback);
                },
                queryInitProveById: function (id, callback, errorCallback) {
                    queryInitProveById(id, callback, errorCallback);
                }
            }
        }]);

        app.controller(app.cname, ["$scope", "$http", '$location', 'uniformService','contactMgrService', /*"uniformCommon","projectBase","ngGrid","uniformService","windowOpenService",*/function ($scope, $http, $location, uniformService, contactMgrService/*$scope,$http,$location,uniformService,windowOpenService*/) {
            /**
             *
             * 现场图片管理控制器--新增和详情
             */
            var view = {
                showCustomerDialog: false,
                showSupplierDialog: false,
                importances: [],
                gendars: []
            };

            var initProveView = {
                bpCode: "",
                bpName: "",
                contactsId: "",
                userName: "",
                gendar: "1",
                orgName: "",
                contactsTitle: "",
                post: "",
                importance: "1",
                fax: "",
                ownBusiness: "",
                phone: "",
                email: "",
                contactsCode: ""
            };

            $scope.customerType = "客户";

            // 获取联系人重要性数据字典
            uniformService.getByNodeKey("PM_IMPORTANCETYPE", function (dicts) {
                view.importances = dicts;
            }, function (error) {
                pms.warn(error);
            });


            $scope.initPage = function () {

                $http.post("crm/paas/crm/contactsInfo/getExampleInfo.do").success(function (data) {
                    /*alert(JSON.stringify(data));*/
                    $scope.initProveView.userName = data.userName;
                    $scope.initProveView.phone = data.phone;
                    $scope.initProveView.gendar = data.gendar == "male" ? "1" : "2";
                    $scope.initProveView.email = data.email;

                });

            };

            $scope.view = view;
            $scope.initProveView = initProveView;

            $scope.customerNameList = [{itemkey: 1, itemName: '客户'}, {itemKey: 2, itemName: '供应商'}];

            $scope.$watch('customerType', function (val) {
                if (val == '客户') {
                    $scope.sourceCustomer = 'source_customer';
                } else {
                    $scope.sourceCustomer = 'source_supplier';
                }
                initProveView.bpCode = "";
                initProveView.bpName = "";

            });

            /**
             * 提交检验
             */
            $scope.submitCheck = function () {
                var message = [];
                /*if (!initProveView.bpCode) {
                 message.push("客商编码必填！");
                 }*/
                if (!initProveView.userName) {
                    message.push("联系人名称必填！");
                }
                if (!initProveView.importance) {
                    message.push("重要性必填！");
                }
                if (!initProveView.fax) {
                    message.push("办公电话必填！");
                }
                if (!(/(^(\d{3,4}-)?\d{7,8})$|(1[358]{1}[0-9]{9})/.test(initProveView.fax))) {
                    message.push("办公电话格式错误！");
                }
                if (!initProveView.phone) {
                    message.push("移动电话必填！");
                }
                if (!(/(^(\d{3,4}-)?\d{7,8})$|(1[358]{1}[0-9]{9})/.test(initProveView.phone))) {
                    message.push("移动电话格式错误！");
                }
                if (message.length > 0) {
                    pms.warn(message.join("\n"));
                    return false;
                }
                return true;
            };

            /**
             * 提交
             */
            $scope.submit = function () {
                $scope.showMask = true;
                if ($scope.submitCheck()) {
                    contactMgrService.saveInitProve(initProveView, function (result) {
                        if (result.result == 1) {
                            $scope.showMask = false;
                            pms.alert(result.message, function () {
                                history.go(-1);
                            });
                        } else if (result.result == 0) {
                            $scope.showMask = false;
                            pms.warn(result.message);
                        }
                    })
                } else {
                    $scope.showMask = false;
                }
            };

            /**
             * 选择客户弹框回调
             */
            $scope.selectCustomer = function (customer) {
                initProveView.bpCode = customer.mdmcode;
                initProveView.bpName = customer.fullname;
            };

            /**
             * 选择供应商弹框回调
             */
            $scope.selectSupplier = function (customer) {
                initProveView.bpCode = customer.mdmcode;
                initProveView.bpName = customer.fullname;
            };

            /**
             * 清空填入
             */
            $scope.clearItem = function () {
                location.reload()
            };

            $scope.goSearchList = function () {
                history.go(-1);
            };


            $scope.initPage();
        }]);
    }
});