/// <reference path="../../js/viewmodels.js" />
(function () {
    var currencies;
    var globalSettings;

    var goToCurrencyDetailsPage = function (invokeEvent) {
        WinJS.Navigation.navigate("/pages/detailpage/detailpage.html", {
            indexInRatesList: invokeEvent.detail.itemIndex
        });
    }

    var setTitle = function (kind) {
        var title = document.querySelectorAll(".pagetitle")[0];
        if (!currencies) {
            Currency.ViewModels.getCurrenciesNames().then(function (data) {
                currencies = JSON.parse(data.responseText);
                globalSettings = Currency.ViewModels.getGlobalSettings();

                if (kind == "long") {
                    title.innerHTML = "Currency rates for " + currencies[globalSettings.baseCurrency];
                } else {
                    title.innerHTML = "Currency rates for " + globalSettings.baseCurrency;
                }
            });
        } else {
            if (kind == "long") {
                title.innerHTML = "Currency rates for " + currencies[globalSettings.baseCurrency];
            } else {
                title.innerHTML = "Currency rates for " + globalSettings.baseCurrency;
            }
        }
        
    }

    var populateCurrencySelect = function (element) {
        if (!currencies) {
            Currency.ViewModels.getCurrenciesNames().then(function (data) {
                currencies = JSON.parse(data.responseText);

                if (!globalSettings) {
                    globalSettings = Currency.ViewModels.getGlobalSettings();
                }

                var sortCurrencies = [];
                for (var currency in currencies) {
                    sortCurrencies.push([currency, currencies[currency]]);
                }

                sortCurrencies.sort(function (a, b) {
                    if (a[1] > b[1]) {
                        return 1;
                    } else if (a[1] < b[1]) {
                        return -1;
                    } else {
                        return 0;
                    }
                });

                for (var i = 0; i < sortCurrencies.length; i++) {
                    if (sortCurrencies[i][0] != "_id") {
                        var option;
                        if (sortCurrencies[i][0] == globalSettings.baseCurrency) {
                            option = new Option(sortCurrencies[i][1], sortCurrencies[i][0], true, true);
                        } else {
                            option = new Option(sortCurrencies[i][1], sortCurrencies[i][0]);
                        }

                        element.options.add(option);

                    }
                }
            });
        }

        
    }

    var setLongTitle = function () {
        setTitle("long");
    }

    var setShortTitle = function () {
        setTitle("short");
    }

    WinJS.Utilities.markSupportedForProcessing(goToCurrencyDetailsPage);

    WinJS.Namespace.define("Currency.HomeCodeBehind", {
        callLoadLatestRates: function () {
                Currency.ViewModels.loadLatestRates();
        },

        goToCurrencyDetailsPage: goToCurrencyDetailsPage,
        setLongTitle: setLongTitle,
        setShortTitle: setShortTitle,
        populateCurrencySelect: populateCurrencySelect
    })
}());