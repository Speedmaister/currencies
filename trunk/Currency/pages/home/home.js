/// <reference path="../../js/data.js" />
/// <reference path="homeCodeBehind.js" />
(function () {
    "use strict";
    var listView;

    WinJS.UI.Pages.define("/pages/home/home.html", {
        ready: function (element, options) {
            Currency.Data.initSettings().then(
                Currency.HomeCodeBehind.callLoadLatestRates
            );

            listView = document.getElementById("rates-list").winControl;
            listView.addEventListener("click", Currency.HomeCodeBehind.goToCurrencyDetailsPage);
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
        } else if (lastViewState === snapped && currentViewState !== snapped) {
            listView.layout = new WinJS.UI.GridLayout();
        }

        lastViewState = currentViewState;
    }
})();
