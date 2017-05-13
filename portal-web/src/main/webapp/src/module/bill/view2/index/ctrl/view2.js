/**
 * Created by IntelliJ IDEA.
 * @author: liubo
 * @time: 17-4-19
 * @des:
 */

define(function (require, exports, module) {
    module.exports = function (app) {
        app.controller(app.cname, ['$scope', '$routeParams', 'RQ', '$timeout', '$location', function ($scope, $routeParams, RQ, $timeout, $location) {
            $scope.name = "Zain Liu";

            console.log("view2 is load.");
        }]);
    }
});
