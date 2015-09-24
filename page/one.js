exports.pageInit = function (element) {
    var _html = require("one.html!text");
    $(element).html(_html);
    dujo.pageShow();
    $("#test").on("click",function () {
        dujo.loadPage("two",{name:"张三"})
    });
}
