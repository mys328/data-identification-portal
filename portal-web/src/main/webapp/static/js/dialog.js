var pms = (function ($) {
    var tpl = [
        "<div class='tips tips-3' style='width: 450px'>",
        "<div class='tips-title'><i class='tips-icon-title'></i>提示：</div>",
        "<div class='tips-content'>",
        "<div class='tips-text'><div class='ico-tips-ok'></div><div class='text' style='overflow: auto; min-height: 20px; max-height: 400px;'></div></div>",
        "<div class='tips-btn'><button type='button'>确定</button></div>",
        "</div>",
        "</div>"
    ];

    var confirmTpl = [
        "<div class='tips tips-2' style='width: 450px'>",
        "<div class='tips-title'><i class='tips-icon-title'></i>提示：</div>",
        "<div class='tips-content'>",
        "<div class='tips-text'><i class='ico-tips-yes'></i><div class='text' style='overflow: auto; min-height: 20px; max-height: 400px;'></div></div>",
        "<div class='tips-btn'>",
        "<button type='button'>取消</button>",
        "<button type='button'>确定</button>",
        "</div>",
        "</div>",
        "</div>"
    ];

    var mask = $("<div style='position: absolute; left: 0px; top: 0px; bottom: 0px; right: 0px; background-color: black'></div>");
    mask.css("position", "absolute");
    mask.css("backgroundColor", "black");
    mask.css("opacity", "0.25");
    mask.css("filter", "alpha(opacity=25)");
    var tplEl = $(tpl.join("")).css("position", "absolute");
    var confirmTplEl = $(confirmTpl.join("")).css("position", "absolute");

    function center(tempEl) {
        mask.css("top", $(window).scrollTop() + "px");
        mask.css("left", $(window).scrollLeft() + "px");
        mask.css("width", $(window).width() + "px");
        mask.css("height", $(window).height() + "px");
        tempEl.css("left", mask.width() / 2 - tempEl.width() / 2 + $(window).scrollLeft() + "px");
        tempEl.css("top", mask.height() / 2 - tempEl.height() / 2 + $(window).scrollTop() + "px");
        tempEl.find("button").focus();
    }

    function show(text, callback) {
        tplEl.find(".tips-text .text").html(text ? text.replace(/\n/g, "<br/>") : text);
        $(document.body).append(mask);
        $(document.body).append(tplEl);
        $(document.documentElement).css("overflow", "hidden");
        $(document.documentElement).css("overflow-x", "hidden");
        $(document.documentElement).css("overflow-y", "hidden");
        $(document.body).bind("mousewheel", disabledMouseWheel);
        center(tplEl);
        tplEl.find("button").click(function () {
            tplEl.remove();
            mask.remove();
            $(window).unbind("resize", center);
            if (callback) {
                callback();
            }
            $(document.documentElement).css("overflow", "visible");
            $(document.documentElement).css("overflow-x", "visible");
            $(document.documentElement).css("overflow-y", "visible");
            $(document.body).unbind("mousewheel", disabledMouseWheel);
        });
        $(window).bind("resize", center);
    }

    function confirm(text, callback) {
        confirmTplEl.find(".tips-text .text").html(text ? text.replace(/\n/g, "<br/>") : text);
        $(document.body).append(mask);
        $(document.body).append(confirmTplEl);
        $(document.documentElement).css("overflow", "hidden");
        $(document.documentElement).css("overflow-x", "hidden");
        $(document.documentElement).css("overflow-y", "hidden");
        $(document.body).bind("mousewheel", disabledMouseWheel);
        center(confirmTplEl);
        confirmTplEl.find("button").click(function () {
            confirmTplEl.remove();
            mask.remove();
            $(window).unbind("resize", center);
            if ($(this).text() == "确定") {
                if (callback) {
                    callback("yes");
                }
            } else if ($(this).text() == "取消") {
                if (callback) {
                    callback("no");
                }
            }
            $(document.documentElement).css("overflow", "visible");
            $(document.documentElement).css("overflow-x", "visible");
            $(document.documentElement).css("overflow-y", "visible");
            $(document.body).unbind("mousewheel", disabledMouseWheel);
        });
        $(window).bind("resize", center);
    }

    function disabledMouseWheel(e) {
        e.preventDefault();
        e.returnValue = false;
        return false;
    }


    return {
        alert: function (text, callback) {
            if (!text) {
                return;
            }
            tplEl.find(".tips-text").children().first()[0].className = "ico-tips-ok";
            show(text, callback);
        },
        warn: function (text, callback) {
            if (!text) {
                return;
            }
            tplEl.find(".tips-text").children().first()[0].className = "ico-tips";
            show(text, callback);
        },
        error: function (text, callback) {
            if (!text) {
                return;
            }
            tplEl.find(".tips-text").children().first()[0].className = "ico-tips-miss";
            show(text, callback);
        },
        confirm: function (text, callback) {
            if (!text) {
                return;
            }
            confirm(text, callback)
        }
    };
})(jQuery);