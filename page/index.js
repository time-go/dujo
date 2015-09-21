exports.pageInit = function (element) {
    var _html = require("index.html!text");
    $(element).html(_html);
    cui.pageShow();
    $(".list").on("click", ">div>div", function () {
        cui.loadPage("detail",{name:"张三",sex:"男"});
    })
    $("footer").on("click", ">a", function () {
        cui.uiMsg("魅力深圳")
    });
}
