/**
 * Created by IntelliJ IDEA.
 * @author: liubo
 * @time: 17-4-19
 * @des: AngularJs 公共资源服务
 */

define(function (require, exports, module) {

    var app = angular.module('app');

    /*公共资源插件服务*/
    app.service('serviceName', ['$rootScope',
        function ($rootScope) {
            /*do something*/
        }
    ]);
});