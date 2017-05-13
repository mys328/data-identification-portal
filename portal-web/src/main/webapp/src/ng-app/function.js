/**
 * Created by IntelliJ IDEA.
 * @author: liubo
 * @time: 17-4-19
 * @des: 通用公共工具函数
 */

define(function () {
    G.windows_width = $(window).width();
    /*全局公共函数*/
    F = {
        //获取url 参数 并转换为json
        getUrlDate: function () {
            var pattern = /(\w+)=(\w+)/ig;
            var parames = {};
            window.location.href.replace(pattern, function (a, b, c) {
                parames[b] = c;
            });
            return parames;
        },

        getUrlDataBySplit: function () {
            var json = {};
            var str = window.decodeURIComponent(location.href);
            //alert(window.decodeURIComponent(location.href));
            var num = str.indexOf("?");
            str = str.substr(num + 1);
            var arr = str.split("&");
            for (var i = 0; i < arr.length; i++) {
                num = arr[i].indexOf("=");
                if (num > 0) {
                    var n = arr[i].substring(0, num);
                    var v = arr[i].substr(num + 1);
                    json[n] = v;
                }
            }
            return json;
        },

        /**
         * 生成UUID
         * @returns {string}
         */
        getUuid: function () {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            // s[8] = s[13] = s[18] = s[23] = "-";
            s[8] = s[13] = s[18] = s[23] = '';
            var uuid = s.join("");
            return uuid;
        }
    }

})
