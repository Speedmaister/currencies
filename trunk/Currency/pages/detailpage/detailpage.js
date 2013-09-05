/// <reference path="../home/homeCodeBehind.js" />
/// <reference path="../../js/chart.js" />
(function () {
    "use strict";

    //var oneMonthBackData;
    var currentElement;

    WinJS.UI.Pages.define("/pages/detailpage/detailpage.html", {
        ready: function (element, options) {
            currentElement = this.element;
            this.historicalData.then(function (data) {
                //oneMonthBackData = data;
                Currency.DetailCodeBehind.drawData(data, currentElement);
                var title = document.getElementsByClassName("pagetitle")[0];
                Currency.DetailCodeBehind.ViewModels.getCurrencyFullName(currentElement, title);
            }, function (error) {
                Currency.Utilities.showMessage("No internet connection.");
            });

            document.getElementById("baseCurrency").style.display = "none";
            document.getElementById("historical").style.display = "none";
            document.getElementById("filter").style.display = "none";
            document.getElementById("latest").style.display = "none";
            document.getElementById("file-exporter").style.display = "none";
        },

        init: function (element, options) {
            var optionsForRequest = {};
            if (options.indexInRatesList != undefined) {
                if (options.referer != undefined && options.referer == "search") {
                    this.element = Currency.Search.ViewModels.resultList.getAt(options.indexInRatesList);
                } else {
                    this.element = Currency.ViewModels.currencies.getAt(options.indexInRatesList);
                }

                optionsForRequest.currency = this.element.currency;
            }
            else {
                this.element = options.item;
                optionsForRequest.currency = options.item.currency;
            }

            optionsForRequest.base = Currency.ViewModels.getGlobalSettings().baseCurrency;
            var from = Currency.ViewModels.getCurrentDate();
            optionsForRequest.till = Currency.DetailCodeBehind.formatDate(new Date(Currency.ViewModels.getCurrentDate()));
            var currentMonth = from.getMonth();
            from.setMonth(currentMonth - 1);
            optionsForRequest.from = Currency.DetailCodeBehind.formatDate(from);

            this.historicalData = Currency.DetailCodeBehind.getMonthBackData(optionsForRequest);
            this.updateLayout(element, Windows.UI.ViewManagement.ApplicationView.value, null);
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
})();
