exports.pageInit = function (element, data) {
    var _html = require("detail.html!text")
    $(element).html(_html);
    cui.pageShow();
    $("#layout-back").click(function () {
        alert(data.name)
        cui.pageBack();
    })

}