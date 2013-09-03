/// <reference path="../home/homeCodeBehind.js" />
/// <reference path="../../js/chart.js" />
// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
    var tempFolder = Windows.Storage.ApplicationData.current.temporaryFolder;
    var oneMonthBackData;
    var currentElement;

    WinJS.UI.Pages.define("/pages/detailpage/detailpage.html", {
        ready: function (element, options) {
            currentElement = this.element;
            this.historicalData.then(function (data) {
                oneMonthBackData = data;
                Currency.DetailCodeBehind.drawData(data, currentElement);
                var title = document.getElementsByClassName("pagetitle")[0];
                Currency.DetailCodeBehind.ViewModels.getCurrencyFullName(currentElement, title);
            }, function (error) {
                console.log(error);
            });

            document.getElementById("baseCurrency").style.display = "none";
            document.getElementById("historical").style.display = "none";
            document.getElementById("filter").style.display = "none";
            document.getElementById("latest").style.display = "none";
        },
        init: function (element, options) {
            var optionsForRequest = {};
            if (options.indexInRatesList != undefined) {
                this.element = Currency.ViewModels.currencies.getAt(options.indexInRatesList);
                optionsForRequest.currency = this.element.currency;
            }
            else {
                this.element = options.item;
                optionsForRequest.currency = options.item.currency;
            }

            optionsForRequest.base = Currency.ViewModels.getGlobalSettings().baseCurrency;
            var from = Currency.ViewModels.getCurrentDate();
            optionsForRequest.till = formatDate(Currency.ViewModels.getCurrentDate());
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
