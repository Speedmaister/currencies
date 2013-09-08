/// <reference path="../../js/viewmodels/homeViewmodel.js" />
(function () {
    var currencies;

    var goToCurrencyDetailsPage = function (invokeEvent) {
        if (WinJS.Navigation.location == "/pages/search/search.html") {
            WinJS.Navigation.navigate("/pages/detailpage/detailpage.html", {
                indexInRatesList: invokeEvent.detail.itemIndex,
                item: item,
                referer: "search"
            });
        } else {
            WinJS.Navigation.navigate("/pages/detailpage/detailpage.html", {
                indexInRatesList: invokeEvent.detail.itemIndex,
                item: item
            });
        }
    }

    var setTitle = function (kind) {
        var title = document.querySelectorAll(".pagetitle")[0];
        if (WinJS.Navigation.location == "/pages/home/home.html") {
            var globalSettings = Currency.ViewModels.getGlobalSettings();
            if (!currencies) {
                Currency.ViewModels.getCurrenciesNames().then(function (data) {
                    currencies = JSON.parse(data.responseText);

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
    }

    var populateCurrencySelect = function (element) {
        if (!currencies) {
            Currency.ViewModels.getCurrenciesNames().then(function (data) {
                currencies = JSON.parse(data.responseText);
                populate(element);
            });
        } else {
            populate(element);
        }

        
    }

    var populate = function (element) {
        var globalSettings = Currency.ViewModels.getGlobalSettings();
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
    }

    var setLongTitle = function () {
        setTitle("long");
    }

    var setShortTitle = function () {
        setTitle("short");
    }

    var setCurrentDate = function (date)
    {
        var currentDateField = document.getElementById("currentDate");
        if (currentDateField) {
            currentDateField.innerText = date.toDateString();
        }
    }

    var filterSelected = function (selection) {
        var newVisible = [];
        var currenciesList = Currency.ViewModels.currencies;
        for (var i = 0; i < selection.length; i++) {
            var item = currenciesList.getAt(selection[i]);
            newVisible.push(item.currency);
        }

        var settings = Currency.ViewModels.getGlobalSettings();
        if (settings) {
            settings.visible = newVisible;
            Currency.Data.setSettings(settings);
        }

        Currency.ViewModels.showFiltered();
    }

    var filterAll = function () {
        Currency.Data.getCurrencies().then(function (data) {
            var currencies = JSON.parse(data.responseText);
            var visible = new Array();

            for (currencyCode in currencies) {
                if (currencyCode !== "_id") {
                    visible.push(currencyCode);
                }
            }

            var settings = Currency.ViewModels.getGlobalSettings();
            if (settings) {
                settings.visible = visible;
                Currency.Data.setSettings(settings);
            }

            Currency.ViewModels.showFiltered();
            
        }, function () {
            Currency.Utilities.showMessage("No internet connection.");
        })
    }

    WinJS.Utilities.markSupportedForProcessing(goToCurrencyDetailsPage);

    WinJS.Namespace.define("Currency.HomeCodeBehind", {
        callLoadLatestRates: function () {
            Currency.ViewModels.loadLatestRates();
        },

        goToCurrencyDetailsPage: goToCurrencyDetailsPage,
        setLongTitle: setLongTitle,
        setShortTitle: setShortTitle,
        populateCurrencySelect: populateCurrencySelect,
        setCurrentDate: setCurrentDate,
        filterSelected: filterSelected,
        filterAll: filterAll
    })
}());