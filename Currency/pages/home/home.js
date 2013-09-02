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

            this.updateLayout(element, Windows.UI.ViewManagement.ApplicationView.value, null);
        },

        updateLayout: function (element, viewState, lastViewState) {
            var listView = document.getElementById("rates-list").winControl;

            if (viewState === Windows.UI.ViewManagement.ApplicationViewState.snapped ||
                viewState === Windows.UI.ViewManagement.ApplicationViewState.fullScreenPortrait) {
                if (listView.layout.horizontal) {
                    listView.layout = new WinJS.UI.ListLayout();
                }
            }
            else {
                if (!listView.layout.horizontal) {
                    listView.layout = new WinJS.UI.GridLayout();
                }
            }

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
