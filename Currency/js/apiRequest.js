WinJS.Namespace.define("Currency.Utilities", {
    ApiRequest: WinJS.Class.define(function () {
        this.baseUrl = "http://currencyrates.eu01.aws.af.cm/";
        
    }, {
        getData: function (options, success, error) {
            var url = this.baseUrl;

            options.command = options.command || "getLatest";

            url += options.command + ".php";
            if (options.query) {
                url += "?" + options.query;
            }

            WinJS.xhr({
                type: "GET",
                url: url,
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