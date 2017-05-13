/**
 * Created by IntelliJ IDEA.
 * @author: liubo
 * @time: 17-4-20
 * @des:
 */
define(function (require, exports, module) {

    module.exports = function (app) {

        app.controller(app.cname, ["$scope", "$http", '$location', 'uniformService', /*"uniformCommon","projectBase","ngGrid","uniformService","windowOpenService",*/function ($scope, $http, $location, uniformService/*$scope,$http,$location,uniformService,windowOpenService*/) {

            var projectModel = {
                projId: "",			//项目ID
                projCode: "",			//项目编号
                projName: "",			//项目名称
                projShortname: "",		//项目简称
                projCustomCode: "",	//项目自定义编号
                projNature: "",		//项目性质
                projKey: "",			//项目分类KEY
                projType: "",			//项目分类
                projProcessCode: "",		//项目过程状态
                projStatusName: "",	//项目过程状态名称
                chargeOrg: "",			//负责部门编号
                chargeOrgName: "",		//负责部门名称
                pmId: "",
                createId: "",			//创建人ID
                createName: "",		//创建人名字
                createDate: "",			//创建时间
                createStartDate: "",  //立项查询开始时间
                createEndDate: "",	//立项查询结束时间
                closeStartDate: "",  //业务关闭查询开始时间
                closeEndDate: "",	//业务关闭查询结束时间
                showOrgDialog: false,
                showManDialog: false,
                projOwnerCode: ""  //甲方项目编号
            };

            $scope.projectModel = projectModel;

            var pb = {
                pageSize: 5,
                currentPage: 1,
                totalCount: 0,
                data: []
            };
            //部门回调
            $scope.selectOrg = function (id, name) {
                $scope.projectModel.chargeOrg = id;
                $scope.projectModel.chargeOrgName = name;
            };
            //项目经理回调
            $scope.selectMan = function (id, name) {
                $scope.projectModel.pmId = id;
                $scope.projectModel.createName = name;
            };

            $scope.pb = pb;

            $scope.pb.data.push($scope.projectModel);

            var view = {
                tempProjectTypeNames: {   //项目类型

                },
                tempProjectNatureNames: {	//项目性质

                },
                tempProjectSts: {			//状态
                    "0": "冻结",
                    "1": "激活"
                },
                showEmergencyDialog: false,
                showMask: false,
                statusFlag: true
            };
            $scope.view = view;

            var params = $location.search();
            //是否默认查询
            if (params.queryFlag && params.queryFlag == "true") {
                //初始化方法，用于初始化数据
                $scope.init();
            }

            $scope._selectList = [];
            //ngGrid配置
            //参考API：https://github.com/angular-ui/ui-grid/wiki/Configuration-Options
            $scope.gridOptions = {
                data: 'rowsList',
                filterOptions: {
                    filterText: "",
                    useExternalFilter: true
                },
                headerRowHeight: 30,
                rowHeight: 40,
                headerRowTemplate: "",
                enableCellSelection: false,
                maintainColumnRatios: true,

                enableCellEdit: false,
                enableColumnResize: true,
                totalServerItems: 'totalServerItems',

                showColumnMenu: true,
                showFilter: false,
                i18n: "zh-cn",
                enablePinning: true,
                enablePaging: true,
                showFooter: true,

                enableRowSelection: true,
                multiSelect: true,
                //checkboxHeaderTemplate:'checkbox.html',
                showSelectionCheckbox: false,//显示checkbox
                pinSelectionCheckbox: false,//固定checkbox
                //selectWithCheckboxOnly:false,
                afterSelectionChange: function (arg0, event) {
                    if (arg0 instanceof Array) {
                        angular.forEach(arg0, function (item) {
                            var index = $.inArray(item.entity, $scope._selectList);
                            if (index == -1) {
                                if (event) {
                                    $scope._selectList.push(item.entity);
                                }
                            } else {
                                if (!event) {
                                    $scope._selectList.splice(index, 1);
                                }
                            }
                        })
                    } else {
                        var index = $.inArray(arg0.entity, $scope._selectList);
                        if (index == -1) {
                            $scope._selectList.push(arg0.entity);
                        } else {
                            $scope._selectList.splice(index, 1);
                        }
                    }

                    console.log($scope._selectList);
                },
                columnDefs: [
                    {
                        field: 'projShortname',
                        width: 150, displayName: '项目简称',
                        cellTemplate: '<a ng-click="showDetail(row.getProperty(\'projId\'))" \
                            id="{{row.getProperty(\'projId\')}}">{{row.getProperty(\'projShortname\')}}</a>'
                    },
                    {field: 'projOwnerCode', width: 150, displayName: '甲方项目编号'},
                    {field: 'projName', width: 150, displayName: '项目名称'},
                    {field: 'projCustomCode', width: 150, displayName: '用户定义项目编号'},
                    {field: 'projCode', width: 150, displayName: '项目编号'},
                    {
                        field: 'projNature', width: 150, displayName: '项目性质',
                        cellTemplate: '<span>{{view.tempProjectNatureNames[row.getProperty(col.field)]}}</span>'
                    },
                    {
                        field: 'projType', width: 150, displayName: '项目类型',
                        cellTemplate: '<span>{{view.tempProjectTypeNames[row.getProperty(col.field)]}}</span>'
                    },
                    {field: 'chargeOrgName', width: 150, displayName: '所属部门'},
                    {field: 'pmName', width: 90, displayName: '项目经理'},
                    {field: 'projProcessName', width: 90, displayName: '项目状态'},
                    {field: 'createDateStr', width: 130, displayName: '立项日期'},
                    {field: 'closeDateStr', width: 130, displayName: '业务关闭日期'},
                    {
                        filed: 'projId',
                        displayName: '操作',
                        width: 100,
                        enableCellEdit: false,
                        sortable: false,
                        //点击详情触发的方法 方法为 detail
                        cellTemplate: '<div class="text-center btn-pop"><a class="btn btn-default btn-sm" data-toggle="dropdown" aria-expanded="false" ng-click="operate(row)" \
                              >操作</a> \
                          <div ng-show="row.getProperty(\'oprateFlag\')" class="dropdown-menu btn-oper-02" role="menu">\
                         <ul ng-repeat="item in oprateItems">\
                             <a title="{{item.struName}}" href="javascript:void(0)" ng-click="goTo(item.confPath);">{{item.struName}}</a>\
                             </ul>\
                         </div>\
                            </div>'
                    },
                    {
                        filed: 'projId',
                        displayName: '业务流程跟踪',
                        width: 120,
                        enableCellEdit: false,
                        sortable: false,
                        //点击详情触发的方法 方法为 detail
                        cellTemplate: '<div class="text-center btn-pop"><a ng-show="row.getProperty(\'projWay\')==1&&(row.getProperty(\'projNature\')!=20 || !row.getProperty(\'projZsxmCode\'))" data-toggle="dropdown" aria-expanded="false" ng-click="lookUp(row)" href="javascript:void(0)">\
                             <i class="fa fa-eye"></i>查看</a>\
                            <div ng-show="FCflag&&row.getProperty(\'projWay\')==1" class="dropdown-menu btn-oper-02" role="menu">\
                           <ul >\
                           <li ng-repeat="item in fc.projectProcessInfoList">\
                               <a title="{{item.schName}}" href="javascript:void(0)" ng-click="toFC(item.actionPath,row);">{{item.schName}}</a>\
                           </li>\
                           </ul>\
                           </div>\
                              </div>'
                    }
                ]
            };

            //详情
            $scope.showDetail = function (projId) {
                var url = "../../pm/project.creation/project.detail.html#/projectInfo?bussinessKey=" + projId;
                window.open(url);
            };

            //操作列表跳转
            $scope.goTo = function (confPath) {
                var d = [];
                d = confPath.split("|");
                if (d[0] == "N") {
                    location.href = d[1];
                } else {
                    var project = [];
                    var projects = [];
                    $scope.projects = projects;
                    var p = [];
                    project = confPath.split(",");
                    if (project.length == 1) {//如果只有一条应急项目
                        location.href = d[1];
                    } else {
                        for (var i = 0; i < project.length; i++) {
                            p = project[i].split("|");
                            $scope.projects.push(p);
                        }
                        view.showEmergencyDialog = true;
                    }
                }
            };

            //操作
            $scope.operate = function (row) {

                $http.get("/fss/pm/paas/pm/projectProcessInfo/queryProjectOperation.do?projectId=" + row.entity.projId).success(function (data) {
                    $scope.oprateItems = data;
                    angular.forEach($scope.rowsList, function (rl) {
                        rl.oprateFlag = false;
                        if (rl.projId == row.entity.projId) {
                            rl.oprateFlag = true;
                        }
                    })
                })
            };

            //翻页
            $scope.switchPage = function (currentPage, pageSize) {
                if (!currentPage) {
                    currentPage = 1;
                }
                if (!pageSize) {
                    pageSize = 5;
                }
                pb.currentPage = currentPage;
                pb.pageSize = pageSize;
                view.showMask = true;

                /*使用JSON文件模拟数据请求*/
                /*$.getJSON("src/module/billDemo.json", function (result) {
                 result.currentPageSize = result.pageSize;
                 $scope.chageContractItem = result;
                 $scope.rowsList = result.data;
                 view.showMask = false;
                 });*/

                $http.post("/fss/pm/paas/pm/projectProcessInfo/genericQueryProject.do", JSON.stringify(pb)).success(function (result) {
                    result.currentPageSize = result.pageSize;
                    $scope.chageContractItem = result;
                    $scope.rowsList = result.data;
                    view.showMask = false;
                }, function (error) {
                    view.showMask = false;
                });
            };

            //勾选单选按钮
            $scope.pro = "";
            $scope.checkPro = function (project) {
                $scope.pro = project;
            };
            //选择应急项目的确定按钮
            $scope.projectChoose = function () {
                if ($scope.pro == undefined || $scope.pro == "") {
                    alert("请选择一个项目/分册！");
                    return;
                } else {
                    location.href = $scope.pro[1];
                }

            };

            //查询
            $scope.search = function () {
                $scope.switchPage();
            };

            //清空查询条件
            $scope.cleanData = function () {
                pms.confirm("确认清空页面查询条件?", function (result) {
                    if (result == 'yes') {
                        $scope.$apply(function () {
                            $scope.projectModel.projShortname = "";//项目简称
                            $scope.projectModel.projName = "";//项目名称
                            $scope.projectModel.projCode = "";//项目编号码
                            $scope.projectModel.projCustomCode = "";//用户自定义编码
                            $scope.projectModel.projNature = "";//项目性质
                            $scope.projectModel.projType = "";//项目类型
                            $scope.projectModel.projProcessCode = "";//项目状态
                            $scope.projectModel.chargeOrg = ""; //负责部门
                            $scope.projectModel.chargeOrgName = "";
                            $scope.projectModel.pmId = "";	//项目经理
                            $scope.projectModel.createName = "";

                            $scope.projectModel.createStartDate = "";// 创建时间
                            $scope.projectModel.createEndDate = "";//

                            $scope.projectModel.closeStartDate = "";//业务关闭开始时间
                            $scope.projectModel.closeEndDate = "";//业务关闭结束时间
                            $scope.projectModel.projOwnerCode = "";  //甲方项目编号
                            angular.forEach($scope.statuses, function (item) {
                                item.ticked = false;
                            });
                        });
                    }
                });
            }
        }]);
    }
});