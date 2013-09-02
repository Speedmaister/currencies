/// <reference path="../../js/data.js" />
/// <reference path="homeCodeBehind.js" />
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        ready: function (element, options) {
            Currency.Data.initSettings().then(function () {
                Currency.HomeCodeBehind.callLoadLatestRates();
                Currency.HomeCodeBehind.setLongTitle();
                var baseCurrencySelect = Currency.DefaultCodeBehind.getBaseCurrencySelect();
                
                Currency.HomeCodeBehind.populateCurrencySelect(baseCurrencySelect);
            });
            
            window.addEventListener("resize", onViewStateChanged);
        },
        init: function (element, options) {
        }
    });

    var lastViewState;

    function onViewStateChanged() {
        var currentViewState = Windows.UI.ViewManagement.ApplicationView.value;
        var snapped = Windows.UI.ViewManagement.ApplicationViewState.snapped;
        var listView = document.getElementById("rates-list");
        var appbar = document.getElementById("appbar").winControl;

        if (currentViewState === snapped) {
            if (listView) {
                listView.winControl.layout = new WinJS.UI.ListLayout();
                Currency.HomeCodeBehind.setShortTitle();
            }
            
            appbar.disabled = true;
        } else if (lastViewState === snapped && currentViewState !== snapped) {
            if (listView) {
                listView.winControl.layout = new WinJS.UI.GridLayout();
                Currency.HomeCodeBehind.setLongTitle();
            }
            
            appbar.disabled = false;
        }

        lastViewState = currentViewState;
    }

})();
