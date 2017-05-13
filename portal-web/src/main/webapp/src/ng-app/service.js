/**
 * Created by IntelliJ IDEA.
 * @author: liubo
 * @time: 17-4-19
 * @des: 通用请求远程服务器服务，封装Angular $http服务
 */

define(function (require, exports, module) {
    var app = angular.module('app');

    app.service('RQ', ['$http', '$cacheFactory', function ($http, $cacheFactory) {

        var config_host = G.api_host;

        var _ext = G.api_host_ext || '';

        /**
         * 通用POST GET的方法 API层需要通过 $.param 进行序列化
         * @param url api链接
         * @param rq  请求 JSON
         * @param cb  回调函数
         * @param cache 是否清除缓存
         * @param host 是否更换主机
         */
        this.get = function (url, rq, cb, host, cache) {
            host = host || config_host;

            url = url.indexOf(_ext) > -1 ? host + url : host + url + _ext;
            if (!$.isEmptyObject(rq)) {
                url = (url.indexOf('?') > -1) ? url + '&' + $.param(rq) : url + '?' + $.param(rq)
            }
            url = (!cache) ? url : ((url.indexOf('?') == -1) ? url + '?' + Math.random() : url + '&' + Math.random());
            $http.get(url).success(function (d) {
                cb(d)
            })
        };

        this.post = function (url, rq, cb, host) {
            host = host || config_host;

            url = url.indexOf(_ext) > -1 ? host + url : host + url + _ext;
            $http.post(url, rq).success(function (d) {
                cb(d)
            })
        };

        this.put = function (url, rq, cb, host) {
            host = host || config_host;

            url = url.indexOf(_ext) > -1 ? host + url : host + url + _ext;
            $http.put(url, rq).success(function (d) {
                cb(d)
            })
        };

        this.delete = function (url, rq, cb, host) {
            host = host || config_host;
            url = url.indexOf(_ext) > -1 ? host + url : host + url + _ext;
            $http.delete(url, rq).success(function (d) {
                cb(d)
            })
        };
    }]);
    /*app.factory('requestCheckLine', ['$q', '$rootScope', '$timeout', '$window', '$location', function ($q, $rootScope, $timeout, $window, $location) {
        return {
            'responseError': function (rejection) {
                //http返回状态码处理
                if (rejection.status === 404) {
                    return $q.reject(rejection);
                } else if (rejection.status === 500) {
                    return $q.reject(rejection);
                } else if (rejection.status === 503) {
                    return $q.reject(rejection);
                } else {
                    return $q.reject(rejection);
                }
            },
            request: function (request) {
                if (request.url.indexOf('.html') == -1) {
                    request.headers = request.headers || {};
                    var userData = $.pgwCookie({name: 'myToken', json: true}) || {};
                    request.headers['sign-h'] = userData.sign;
                    request.headers['token-h'] = userData.token;
                } else {
                    var params = F.getUrlDate();
                    //订单来源
                    var place = F.getStore(M.ORDER_SOURCE);
                    if (params.place && !place) {
                        F.storeJson(M.ORDER_SOURCE, params.place);
                    }
                    //特殊渠道来源
                    var fromChannel = F.getStore(M.SPECIAL_CHANNEL);
                    if (params.fromChannel && (!fromChannel || fromChannel != params.fromChannel)) {
                        F.storeJson(M.SPECIAL_CHANNEL, params.fromChannel);
                    }
                    //第三方token登录
                    if (params.lkey) {
                        F.otherLogin(params.lkey);
                    }
                }
                return request;
            },
            response: function (response) {
                if (response.data) {

                }
                return response;
            }
        };
    }]);*/

    app.directive('compile', function ($compile) {//编译HTML代码段
        return function (scope, element, attrs) {
            scope.$watch(
                function (scope) {
                    return scope.$eval(attrs.compile);
                },
                function (value) {
                    element.html(value);
                    $compile(element.contents())(scope);
                }
            );
        };
    });

    app.factory("customerService", ["$http", "contextServer", function ($http, contextServer) {
        /**
         * 客户查询
         * @param data  客户查询参数
         * @param callback   查询成功后的回调函数
         */
        function getCustomer(data, callback, errorCallback) {
            $http.post("/ct/paas/us/commonresource/getCustomer.do", {
                params: {
                    mdmcode: data.customer.code,            // 客户编号
                    fullname: data.customer.name,           // 客户全称
//                    customertype: data.customer.type,       // 客户类型
                    sourcetype: data.customer.sourcetype,	//参数来源
                    pageSize: data.pageSize,                // 页尺寸
                    currentPage: data.currentPage           // 当前页号
                }
            }).success(function (customers) {    // 成功回调函数， customers为标准的pageBean格式json对象
                /*debugger;*/
                if (callback) {
                    callback(customers);
                }
            }).error(errorCallback);
        };

        /**
         * 联系人查询
         * @param data    联系人查询参数
         * @param callback
         */
        function getContactPage(queryObj, callback, errorCallback) {
            $http.jsonp(contextServer + "/ct/paas/us/commonresource/getContactsInfo.do?callback=JSON_CALLBACK", {
                params: queryObj
            }).success(function (contacts) {          //  成功回调函数， contacts为标准的pageBean格式json对象
                if (callback) {
                    callback(contacts);
                }
            }).error(errorCallback);
        };

        /**
         * 添加联系人
         * @param contact    联系人对象
         * @param callback   成功后回调函数
         * @param errorCallback   错误时的回调函数
         */
        function addContact(contact, callback, errorCallback) {
            $http.jsonp(contextServer + "/ct/paas/us/commonresource/addContact.do?callback=JSON_CALLBACK", {
                params: contact
            }).success(function (result) {
                if (callback) {
                    callback(result);
                }
            })
        };

        //获取业务字典键值对
        function getBizDictMapNodes(params, callback, errorCallback) {
            $http.jsonp(contextServer + "/ct/paas/ct/resource/getBizDictMapNodes.do?callback=JSON_CALLBACK", {
                params: {
                    nodeKey: params           		 // 合同编码
                }
            }).success(function (result) {
                if (callback) {
                    callback(result);
                }
            }).error(errorCallback);
        };

        return {
            getCustomer: function (queryObj, callback, errorCallback) {
                getCustomer(queryObj, callback, errorCallback);
            },
            getContactPage: function (queryObj, callback, errorCallback) {
                getContactPage(queryObj, callback, errorCallback);
            },
            addContact: function (contact, callback, errorCallback) {
                addContact(contact, callback, errorCallback);
            },
            getBizDictMapNodes: function (params, callback, errorCallback) {
                getBizDictMapNodes(params, callback, errorCallback);
            }
        };
    }]);
});
