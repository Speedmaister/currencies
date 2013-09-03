/// <reference path="../../js/data.js" />
/// <reference path="homeCodeBehind.js" />
(function () {
    "use strict";

    var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();

    WinJS.UI.Pages.define("/pages/home/home.html", {
        ready: function (element, options) {
            Currency.Data.initSettings().then(function () {
                Currency.HomeCodeBehind.callLoadLatestRates();
                Currency.HomeCodeBehind.setLongTitle();
                var baseCurrencySelect = Currency.DefaultCodeBehind.getBaseCurrencySelect();
                var fromCurrencySelect = Currency.DefaultCodeBehind.getFromCurrencySelect();
                var toCurrencySelect = Currency.DefaultCodeBehind.getToCurrencySelect();

                dataTransferManager.addEventListener("datarequested", Currency.ViewModels.shareFileHandler);

                Currency.HomeCodeBehind.populateCurrencySelect(baseCurrencySelect);
                Currency.HomeCodeBehind.populateCurrencySelect(fromCurrencySelect);
                Currency.HomeCodeBehind.populateCurrencySelect(toCurrencySelect);
            });

            var filterShowAll = document.getElementById("filterShowAll").winControl;
            var filterShowSelected = document.getElementById("filterShowSelected").winControl;
            var listView = document.getElementById("rates-list").winControl;

            filterShowSelected.addEventListener("click", function () {
                if (listView.selection._selected) {
                    var selection = listView.selection.getIndices();
                    if (selection.length > 0) {
                        Currency.HomeCodeBehind.filterSelected(selection);
                    } else {
                        Currency.Utilities.showMessage("No currencies are selected!");
                    }
                }
               
            });

            filterShowAll.addEventListener("click", function () {
                Currency.HomeCodeBehind.filterAll();
            });

            document.getElementById("baseCurrency").style.display = "";
            document.getElementById("historical").style.display = "";
            document.getElementById("filter").style.display = "";
            document.getElementById("latest").style.display = "";
            document.getElementById("file-exporter").style.display = "";

            var currentDate = Currency.ViewModels.getCurrentDate();
            if (currentDate) {
                Currency.HomeCodeBehind.setCurrentDate(currentDate);
            }

            this.updateLayout(element, Windows.UI.ViewManagement.ApplicationView.value, null);
        },

        updateLayout: function (element, viewState, lastViewState) {
            var listView = document.getElementById("rates-list").winControl;
            var appbar = document.getElementById("appbar").winControl;

            if (viewState === Windows.UI.ViewManagement.ApplicationViewState.snapped) {
                if (listView.layout.horizontal) {
                    listView.layout = new WinJS.UI.ListLayout();

                }

                Currency.HomeCodeBehind.setShortTitle();
                appbar.disabled = true;
            }
            else if (!listView.layout.horizontal) {
                listView.layout = new WinJS.UI.GridLayout();
                Currency.HomeCodeBehind.setLongTitle();
                appbar.disabled = false;
            }
        }
    });
})();
