WinJS.Namespace.define("Currency.Utilities", {
    ClientInfo: WinJS.Class.define(function () {
        this.baseUrl = "http://ip-api.com/json";

    }, {
        getData: function (success, error) {

            WinJS.xhr({
                type: "GET",
                url: this.baseUrl,
                responseType: "json",
                headers: { "Content-Type": "application/json" }
            }).then(function (data) {
                success(data);
            }, function (message) {
                error(message);
            });
        }
    })
});