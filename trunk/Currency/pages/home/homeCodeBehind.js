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
        setShortTitle: setShortTitle
    })
}());