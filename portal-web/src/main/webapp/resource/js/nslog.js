/**
 * Created by ThinkPad on 2017/3/23.
 */
function nslog() {
    nsLog.init();
    nsLog.sendLog(arguments[0], arguments[1], arguments[2]);
}

var nsLog = {
    options: {},
    _globalDetail: {},
    init: function(args) {
        var defaults = {
            type: undefined,
            url: window.location.href,
            referrer: document.referrer || ''
        };
        this.options = $.extend(true, {}, defaults, args);
    },
    set: function(key, value) {
        this.options[key] = value;
    },
    req: function(params) {
        //$.post('/util/saveClickAction',params);
    },
    log: function() {
        var self = this,
            t = (new Date()).getTime(),
            params = {
                t: t
            };

        for (var k in self.options) {
            params[k]=self.options[k];
        }
        self.req(params);
    },
    autoListen: function() {
        var self = this,
            $window = $(window);

        if (/ipad/i.test(navigator.userAgent)) {
            document.addEventListener('touchstart', function (e) {
                try {
                    if (e.touches.length !== 1) {
                        return;
                    }
                    var ele = e.touches[0].target;
                    var x_start = e.touches[0].pageX;
                    var y_start = e.touches[0].pageY;

                    function touchend(e) {
                        if (e.changedTouches.length !== 1) {
                            return;
                        }
                        var x_end = e.changedTouches[0].pageX;
                        var y_end = e.changedTouches[0].pageY;
                        var istap = Math.abs(x_end - x_start) < 5 && Math.abs(y_end - y_start) < 5 ? true : false;
                        istap && self.loop(ele);
                        ele.removeEventListener('touchend', touchend);
                    }

                    ele.addEventListener('touchend', touchend);
                } catch (e) {}
            });
        } else {
            $window.on('mousedown', function (e) {
                try {
                    var ele = e.target;
                    self.loop(ele);
                } catch (e) {}
            });
        }
    },
    loop: function(ele) {
        var deep = 3;
        var continueNslog = true;
        var self = this;
        var linkClick = false;
        var url;
        var linkHref = '';
        var type;
        var nslog;
        var detail;
        var $ele;

        while (ele) {
            if (ele.nodeType == 1) {
                $ele = $(ele);
                nslog = $ele.attr('nslog') || 'normal';
                url = ele.href || window.location.href;
                type = $ele.attr('nslog-type');
                detail = $ele.attr('nslog-params');
                detail && (detail = $.parseJSON(detail));

                if (deep > 0) {
                    if (type && continueNslog && (nslog === 'normal')) {
                        self.sendLog(type, url, detail);
                        continueNslog = false;
                    }
                    if (!linkClick && (ele.href
                        || (/input/i.test(ele.tagName) && /button|radio|checkbox|submit/i.test(ele.type))
                        || /img/i.test(ele.tagName))) {
                        linkClick = true;
                        linkHref = url;
                    }
                }

                if (linkClick && nslog === 'area') {
                    self.sendLog(type, linkHref, detail);
                }
            }
            deep--;
            ele = ele.parentNode;
        }
    },
    sendLog: function(type, url, detail) {
        var self = this;

        if (type) {
            self.init();

            if (url && url !== 'javascript:;') {
                self.options.url = url;
            }

            self.options.type = type;
            self.options = $.extend(true, {}, self.options, detail, nsLog._globalDetail);
            self.log();
        }
    },
    setGlobal: function (data) {
        nsLog._globalDetail = data;
    }
};

// 寮€鍚嚜鍔ㄦ墦鐐�
nsLog.autoListen();

window.nslog = nslog;
