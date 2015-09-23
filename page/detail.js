exports.pageInit = function (element, data) {
    var _html = require("detail.html!text")
    $(element).html(_html);
    dujo.pageShow();
    $("#layout-back").click(function () {
        alert(data.name)
        dujo.pageBack();
    })

}