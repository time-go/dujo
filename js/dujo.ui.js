(function (w, $) {
    dujo.uiShowMessage = function (msg) {
        dujo.lockScreen();
        var _w = $(w).width();
        //消息
        if ($("#dujo-toast-container").length <= 0) {
            $("body").append("<div id='dujo-toast-container'></div>");
        }
        //计算消息位置
        $("#dujo-toast-container").html(msg);
        $("#dujo-toast-container").show();
        var _left = (_w - $("#dujo-toast-container").outerWidth()) / 2;
        $("#dujo-toast-container").css("left", _left + "px");
    }
    dujo.uiHideMessage = function () {
        $("#dujo-toast-container").hide();
        dujo.unlockScreen();
    }
    dujo.uiHideMsg = function () {
        $("#dujo-toast-container").fadeOut("fast", function () {
            dujo.unlockScreen();
            $("#dujo-toast-container").remove();
        });
    }
    dujo.uiMsg = function (msg, foo) {
        dujo.uiShowMessage(msg);
        setTimeout(function () {
            dujo.uiHideMsg();
            if (typeof foo == "function") foo();
        }, 1200)
    }
})(window, jQuery);