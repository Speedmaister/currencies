WinJS.Namespace.define("Currency.Utilities", {
    ClientInfo: WinJS.Class.define(function () {
        this.baseUrl = "http://ip-api.com/json";

    }, {
        getData: function () {

            return WinJS.xhr({
                type: "GET",
                url: this.baseUrl,
                responseType: "json",
                headers: { "Content-Type": "application/json" }
            })
        }
    })
});