/// <reference path="../../js/data.js" />
/// <reference path="homeCodeBehind.js" />
(function () {
    "use strict";
    var listView;
    var appbar;

    WinJS.UI.Pages.define("/pages/home/home.html", {
        ready: function (element, options) {
            Currency.Data.initSettings().then(function () {
                Currency.HomeCodeBehind.callLoadLatestRates();
                Currency.HomeCodeBehind.setLongTitle();
                var baseCurrencySelect = Currency.DefaultCodeBehind.getBaseCurrencySelect();
                appbar = document.getElementById("appbar").winControl;
                Currency.HomeCodeBehind.populateCurrencySelect(baseCurrencySelect);
            });

            listView = document.getElementById("rates-list").winControl;
            window.addEventListener("resize", onViewStateChanged);
        },
        init: function (element, options) {
        }
    });

    var lastViewState;

    function onViewStateChanged() {
        var currentViewState = Windows.UI.ViewManagement.ApplicationView.value;
        var snapped = Windows.UI.ViewManagement.ApplicationViewState.snapped;

        if (currentViewState === snapped) {
            listView.layout = new WinJS.UI.ListLayout();
            Currency.HomeCodeBehind.setShortTitle();
            appbar.disabled = true;
        } else if (lastViewState === snapped && currentViewState !== snapped) {
            listView.layout = new WinJS.UI.GridLayout();
            Currency.HomeCodeBehind.setLongTitle();
            appbar.disabled = false;
        }

        lastViewState = currentViewState;
    }

})();
