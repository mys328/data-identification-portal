/**
 * Created by IntelliJ IDEA.
 * @author: liubo
 * @time: 17-4-19
 * @des: AngularJS 初始化依赖注入配置
 */

define(function (require, exports, module) {
    var app = angular.module('app', ['ngRoute', 'ngSanitize', 'ngsea', 'ang-commfn', 'ksSwiper', 'uniformCommon', 'ngGrid', 'taskChooseUser','ngTable',/*, 'projectBase', 'ngGrid'*/])
        .run(['$rootScope', '$timeout', '$ngsea', function ($rootScope, $timeout, $ngsea) {

            console.log('angular module initialization success.');

            $rootScope.G = G;
            $rootScope.F = F;
            $rootScope.M = M;
            var conf = {project: 'bill', module: 'billDemo', controller: 'index', action: 'billDemo', version: G.load_version || ''};
            $ngsea(app, conf);
            $rootScope.$on('$routeChangeSuccess', function (e, target) {
                $('body').scrollTop(0);
            });

            //全局标题
            F.title = function (title) {
                $rootScope.site_title = title && (title);
            };

            F.title("View");

            //保存上一次访问坐标
            F.setLastWeb = function () {
                var lastView = '?' + $.param(F.getUrlParames());
                $.pgwCookie({name: 'lastView', value: lastView});
            };

            //跳到上一次访问坐标
            F.goLastWeb = function () {
                var lastWeb = $.pgwCookie({name: 'lastView'});
                if (lastWeb && lastWeb.indexOf('login') == -1) {
                    window.location.href = lastWeb;
                } else {
                    window.location.href = '?module=home&controller=index&action=home';
                }
            };

            //将某个对象存入缓存
            F.storeJson = function (key, object) {
                var jsonObj = JSON.stringify(object);
                localStorage.setItem(key, jsonObj);
            };
            //从缓存中读取某个key对应的对象
            F.getStore = function (key) {
                var rtObj = {};
                var jsonObj = localStorage.getItem(key);
                rtObj = JSON.parse(jsonObj);
                return rtObj;
            }
            //从缓存中删除
            F.delStore = function (key) {
                localStorage.removeItem(key);
            };

            F.getAndDelStore = function (key) {
                var rtObj = {};
                var jsonObj = localStorage.getItem(key);
                rtObj = JSON.parse(jsonObj);
                localStorage.removeItem(key);
                return rtObj;
            };

            //判断是否空
            F.isEmpty = function (object) {
                var result = true;
                if (typeof object === 'object') {
                    for (var index in object) {
                        result = false;
                        break;
                    }
                } else {
                    result = !object;
                }
                return result;
            };

            /**定义一个全局Map对象*/
            G.dataMap = new Map();
        }]);
});
