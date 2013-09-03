/// <reference path="../home/homeCodeBehind.js" />
/// <reference path="../../js/chart.js" />
// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/detailpage/detailpage.html", {
        ready: function (element, options) {
            var element = this.element;
            this.historicalData.then(function (data) {
                Currency.DetailCodeBehind.drawData(data, element);
                var title = document.getElementsByClassName("pagetitle")[0];
                Currency.DetailCodeBehind.ViewModels.getCurrencyFullName(element, title);
            }, function (error) {
                console.log(error);
            });

            document.getElementById("baseCurrency").style.display = "none";
            document.getElementById("historical").style.display = "none";
            document.getElementById("filter").style.display = "none";
        },
        init: function (element, options) {
            this.element = Currency.ViewModels.currencies.getAt(options.indexInRatesList);
            var optionsForRequest = {};
            optionsForRequest.base = Currency.ViewModels.getGlobalSettings().baseCurrency;
            optionsForRequest.currency = this.element.currency;
            var from = new Date();
            optionsForRequest.till = formatDate(new Date());
            var currentMonth = from.getMonth();
            from.setMonth(currentMonth - 1);
            optionsForRequest.from = formatDate(from);

            this.historicalData = Currency.DetailCodeBehind.getMonthBackData(optionsForRequest);
            this.updateLayout(element, Windows.UI.ViewManagement.ApplicationView.value, null);
        },
        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            var appbar = document.getElementById("appbar").winControl;

            if (viewState === Windows.UI.ViewManagement.ApplicationViewState.snapped) {
                appbar.disabled = true;
            }
            else {
                if (appbar) {
                    appbar.disabled = false;
                }
            }
        }
    });

    function formatDate(date) {
        var dateStr = padStr(date.getFullYear()) + "-" +
                padStr(1 + date.getMonth()) + "-" +
                padStr(date.getDate());
        return dateStr;
    }

    function padStr(i) {
        return (i < 10) ? "0" + i : "" + i;
    }

    

})();
