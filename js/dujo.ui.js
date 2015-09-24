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
//外面可以调用方法
;
/*通用弹出框*/
(function () {
    $("body").bind("touchmove", function () {
        return false;
    });
    var $css3Transform = function (element, attribute, value) {
        var arrPriex = ["O", "Ms", "Moz", "Webkit", ""], length = arrPriex.length;
        for (var i = 0; i < length; i += 1) {
            element.css(arrPriex[i] + attribute, value);
        }
    }
    var game = {};
    game.zIndex = 12;//背景z-index
    game.stack = [];//弹出框 z-index栈
    game.stackPop = [];//弹出框对象
    game.showPop = function (element, callback, iClose) {
        var divgame = $("body");
        if (game.stack.length == 0) {
            divgame.append("<div id='pop-bg' class='pop-bg'></div>");
            game.zIndex = 12;
            $("#pop-bg").css("zIndex", game.zIndex);
        } else {
            game.zIndex = game.stack[game.stack.length - 1] + 1;
            $("#pop-bg").css("zIndex", game.zIndex);
        }
        var pop = $("<div class='pop-container'></div>");
        divgame.append(pop);
        var zPop = game.zIndex + 1;
        pop.css("zIndex", zPop);
        game.stack.push(zPop);
        game.stackPop.push(pop);
        element = $(element);
        pop.append(element);
        if (typeof callback == "function") callback(element[0]);
        var x = ($(window).width() - pop.width()) / 2;
        var y = ($(window).height() - pop.height()) / 2;
        pop.css("left", x + "px");
        pop.css("top", y + "px");
        pop.removeClass("pop-container-animate");
        setTimeout(function () {
            pop.addClass("pop-container-animate");
            $css3Transform(pop, "Transform", "scale(1, 1)");
            $css3Transform(pop, "opacity", "1");
            setTimeout(function () {
                pop.removeClass("pop-container-animate");
                if (!((typeof iClose != "undefined") && iClose === false)) {
                    pop.addClass("iClose");
                }
                $("#pop-bg").unbind("click").bind("click", function () {
                    var element = game.stackPop[game.stackPop.length - 1];
                    if (element.hasClass("iClose")) {
                        game.closePop();
                    }
                })

            }, 300);
        }, 30);

    };
    game.closePop = function () {
        var pop = game.stackPop.pop();
        var zPop = game.stack.pop();
        if (game.stack.length == 0) {
            $("#pop-bg").remove();
            game.zIndex = 12;
        } else {
            game.zIndex = game.stack[game.stack.length - 1] - 1;
            $("#pop-bg").css("zIndex", game.zIndex);
        }
        pop.addClass("pop-container-animate");
        $css3Transform(pop, "opacity", "0");
        $css3Transform(pop, "Transform", "scale(0, 0)");
        setTimeout(function () {
            pop.remove();
        }, 300);
    }
    $(window).on("resize", function () {
        var pops = $(".pop-container");
        if (pops.length > 0) {
            pops.each(function () {
                var pop = $(this);
                var divgame = $("body");
                var x = ($(window).width() - pop.width()) / 2;
                var y = ($(window).height() - pop.height()) / 2;
                pop.css("left", x + "px");
                pop.css("top", y + "px");
            });
        }
    });
    dujo.pop = game;//弹出框通用组件

})()
    /*确认提示框*/
;
(function () {
    dujo.confrim = function (info, style, callback) {
        var html = "";
        html += "<div class='confrim'>";
        html += "<div class='title'>温馨提示</div>";
        html += "<div class='info'><div class='icon " + style + "'></div><div class='text'>" + info + "</div></div>";
        html += "<div class='row'>";
        html += "<div class='column column-auto'></div>";
        html += "<div class='button button-grey btn cancel'>取消</div>";
        html += "<div class='button button-dkyellow btn ok'>确认</div>";
        html += "<div class='column column-auto'></div>";
        html += "</div>";
        html += "</div>";
        dujo.pop.showPop($(html), function (element) {
            $(element).find(".ok").on("click", function () {
                dujo.pop.closePop();
                if (typeof callback == "function") callback();
            });
            $(element).find(".cancel").on("click", function () {
                dujo.pop.closePop();
            });
        }, false);
    }
})();
dujo.showPageLoad = function (element) {
    var _html = "<div class=\"page-load\">" +
        "<div class=\"spinner\">" +
        "</div>" +
        "</div>";
    $(element).append($(_html))
}
dujo.removePageLoad = function (element) {
    $(element).find(".page-load").remove();
}