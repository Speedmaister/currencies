/// <reference path="../../js/data.js" />
/// <reference path="homeCodeBehind.js" />
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        ready: function (element, options) {
            Currency.Data.initSettings().then(
                Currency.HomeCodeBehind.callLoadLatestRates
            );
        },
        init: function (element, options) {
        }
    });
})();
