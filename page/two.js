exports.pageInit = function (element, data) {
    var _html = require("two.html!text")
    $(element).html(_html);
    $("#name").html(data.name);
    dujo.showPageLoad(element);
    dujo.pageShow();
    setTimeout(function(){
        dujo.removePageLoad(element)
    },3000)
    $("#layout-message").click(function () {
        dujo.uiMsg("杜鹃花")
    })
    $("#layout-back").click(function () {
        dujo.confrim(data.name + "要返回吗", "question", function () {
            dujo.pageBack()
        });
    })

}