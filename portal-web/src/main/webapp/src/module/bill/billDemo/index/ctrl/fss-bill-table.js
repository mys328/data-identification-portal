define(function (require, exports, module) {

    module.exports = function (app) {

        app.controller(app.cname, ["$scope", "$http", '$location', 'uniformService', /*"uniformCommon","projectBase","ngGrid","uniformService","windowOpenService",*/function ($scope, $http, $location, uniformService/*$scope,$http,$location,uniformService,windowOpenService*/) {

            $scope.selectedRow = undefined; //接收表格选中多选框后的行数据

            $scope.pageConfig = {
                totalPage: 2,
                totalCount: 6,
                pageSize: 5,
                currentPage: 1
            }; //初始化表格分页插件，配置显示分页时必须初始化

            var data2 = [{
                id: 1,
                name: "测试父001",
                pId: null,
                cId: null,
                cName: null,
                filter: '测试过滤函数',
                title1: '数据',
                innerHtml: '测试插入'
            }, {
                id: null,
                name: null,
                pId: 1,
                cId: 1,
                cName: '测试子01',
                filter: '测试过滤函数',
                title1: '数据',
                innerHtml: '测试插入'
            }, {
                id: null,
                name: null,
                pId: 1,
                cId: 1,
                cName: '测试子02',
                filter: '测试过滤函数',
                title1: '数据',
                innerHtml: '测试插入'
            }, {
                id: null,
                name: null,
                pId: 1,
                cId: 1,
                cName: '测试子03',
                filter: '测试过滤函数',
                title1: '数据',
                innerHtml: '测试插入'
            }, {
                id: 2,
                name: "测试父002",
                pId: null,
                cId: null,
                cName: null,
                filter: '测试过滤函数',
                title1: '数据',
                innerHtml: '测试插入'
            }, {
                id: null,
                name: null,
                pId: 2,
                cId: 1,
                cName: '测试子01',
                filter: '测试过滤函数',
                title1: '数据',
                innerHtml: '测试插入'
            }, {
                id: null,
                name: null,
                pId: 2,
                cId: 1,
                cName: '测试子02',
                filter: '测试过滤函数',
                title1: '数据',
                innerHtml: '测试插入'
            }, {
                id: null,
                name: null,
                pId: 2,
                cId: 1,
                cName: '测试子03',
                filter: '测试过滤函数',
                title1: '数据',
                innerHtml: '测试插入'
            }, {
                id: 3,
                name: "测试父002",
                pId: null,
                cId: null,
                cName: null,
                filter: '测试过滤函数',
                title1: '数据',
                innerHtml: '测试插入'
            }];

            var data = [{
                id: null,
                name: null,
                pId: 1,
                cId: 1,
                cName: '测试子01',
                filter: '测试过滤函数',
                title1: '数据',
                innerHtml: '测试插入'
            }, {
                id: 1,
                name: "测试父01",
                pId: null,
                cId: null,
                cName: null,
                filter: '测试过滤函数',
                title1: '数据',
                innerHtml: '测试插入'
            }, {
                id: null,
                name: null,
                pId: 1,
                cId: 1,
                cName: '测试子02',
                filter: '测试过滤函数',
                title1: '数据',
                innerHtml: '测试插入'
            }, {
                id: 2,
                name: "测试父02",
                pId: null,
                cId: null,
                cName: null,
                filter: '测试过滤函数',
                title1: '数据',
                innerHtml: '测试插入'
            }, {
                id: null,
                name: null,
                pId: 1,
                cId: 1,
                cName: '测试子03',
                filter: '测试过滤函数',
                title1: '数据',
                innerHtml: '测试插入'
            }, {
                id: null,
                name: null,
                pId: 2,
                cId: 1,
                cName: '测试子01',
                filter: '测试过滤函数',
                title1: '数据',
                innerHtml: '测试插入'
            }, {
                id: null,
                name: null,
                pId: 2,
                cId: 1,
                cName: '测试子02',
                filter: '测试过滤函数',
                title1: '数据',
                innerHtml: '测试插入'
            }, {
                id: null,
                name: null,
                pId: 2,
                cId: 1,
                cName: '测试子03',
                filter: '测试过滤函数',
                title1: '数据',
                innerHtml: '测试插入'
            }];

            $scope.config = {
                data: data, //数据对象
                matchFiled: {
                    id: 'id',
                    pId: 'pId'
                }, //子行关联父行字段标示
                pagingOptions: true, //是否启用自带分页插件
                pagingChangeFn: function (currentPage, pageSize) {
                    /*console.log(currentPage + "," + pageSize);*/
                    $scope.reload(currentPage, pageSize);
                },
                enableSelected: true, //行是否可选中
                /*multipleCheck: true,*/ // 是否支持多选
                column: [
                    {
                        filed: 'id',
                        displayName: 'ID',
                        width: 100,
                        openChildRow: true,
                    }, {
                        filed: 'name',
                        displayName: '测试父名称',
                        width: 100
                    }, {
                        filed: 'pId',
                        displayName: '父ID',
                        width: 50
                    }, {
                        filed: 'cId',
                        displayName: '子ID',
                        width: 100
                    }, {
                        filed: 'cName',
                        displayName: '子名称',
                        width: 100
                    }, {
                        filed: 'filter',
                        displayName: '测试过滤函数',
                        width: 150,
                        formatter: function (value, row) { //格式化方法
                            return value + "_G";
                        }
                    }, {
                        filed: 'title1',
                        displayName: '表头1',
                        width: 100
                    }, {
                        filed: 'innerHtml',
                        displayName: '测试插入HTML页面',
                        width: 200,
                        formatter: function (value, row) { //格式化方法
                            if (!value) {
                                value = "";
                            }
                            return "<button type='button'>" + value + "</button>";
                        }
                    }
                ]
            };

            /*页面跳页回调函数*/
            $scope.reload = function (currentPage, pageSize) {
                /*将远程服务器的数据更新到绑定数据中*/
                $scope.config.data = data2;

                /*更新分页数据*/
                $scope.pageConfig = {
                    totalPage: 2,
                    totalCount: 10,
                    pageSize: '10', //页面大小徐转换为字符串
                    currentPage: 1
                };
            }
        }]);
    }
});