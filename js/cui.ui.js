(function (w, $) {
    cui.uiShowMessage = function (msg) {
        cui.lockScreen();
        var _w = $(w).width();
        //消息
        if ($("#cui-toast-container").length <= 0) {
            $("body").append("<div id='cui-toast-container'></div>");
        }
        //计算消息位置
        $("#cui-toast-container").html(msg);
        $("#cui-toast-container").show();
        var _left = (_w - $("#cui-toast-container").outerWidth()) / 2;
        $("#cui-toast-container").css("left", _left + "px");
    }
    cui.uiHideMessage = function () {
        $("#cui-toast-container").hide();
        cui.unlockScreen();
    }
    cui.uiHideMsg = function () {
        $("#cui-toast-container").fadeOut("fast", function () {
            cui.unlockScreen();
            $("#cui-toast-container").remove();
        });
    }
    cui.uiMsg = function (msg, foo) {
        cui.uiShowMessage(msg);
        setTimeout(function () {
            cui.uiHideMsg();
            if (typeof foo == "function") foo();
        }, 1200)
    }
})(window, jQuery);