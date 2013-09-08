(function () {
    var CrossRateListModel = WinJS.Class.define(function (code, name) {
        this.code = code;
        this.name = name;
    }, {
        code: "",
        name: ""
    })

    WinJS.Namespace.define("Currency.Models", {
        CrossRateListModel: CrossRateListModel
    })
}());