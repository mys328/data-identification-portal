/**
 * Created by IntelliJ IDEA.
 * @author: liubo
 * @time: 17-4-19
 * @des:
 */

define(function (require, exports, module) {
    module.exports = function (app) {
        app.controller(app.cname, ['$scope', '$routeParams', 'RQ', '$timeout', '$location', function ($scope, $routeParams, RQ, $timeout, $location) {
            //渲染数据
            $scope.load = function () {
                //模拟数据请求
                /*RQ.get("/api/test.do", {}, function (res) {
                 /!*格式化数据操作*!/
                 });*/

                $.getJSON("src/module/bill/demo.json", function (data) {
                    console.log(data);
                    $scope.names = data.records;
                });
            };

            //页面初始化
            $scope.load();

            console.log("view1 is load.");
        }]);
    }
});
