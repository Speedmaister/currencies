WinJS.Namespace.define("Currency.Utilities", {
    ApiRequest: WinJS.Class.define(function () {
        this.baseUrl = "http://currencyrates.eu01.aws.af.cm/";
        
    }, {
        getData: function (options) {
            var url = this.baseUrl;

            options.command = options.command || "getLatest";

            url += options.command + ".php";
            if (options.query) {
                url += "?" + options.query;
            }

            return WinJS.xhr({
                type: "GET",
                url: url,
                responseType: "json",
                headers: { "Content-Type": "application/json" }
            });
        },

        sendError: function (data) {
            var url = this.baseUrl;
            var sendData = "data=" + JSON.stringify(data);

            url += "sendErrorReport.php";

            return WinJS.xhr({
                type: "POST",
                url: url,
                data: sendData,
                headers: { "Content-type": "application/x-www-form-urlencoded" }
            });
        }
    })
});