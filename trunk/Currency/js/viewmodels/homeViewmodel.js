/// <reference path="../data.js" />
(function () {
    var currenciesList = new WinJS.Binding.List([]);
    var currencyDTOs;
    var downloadedRates;

    var getGlobalSettings = function () {
        return Currency.Data.getSettings();
    }

    var loadLatestRates = function () {
        if (currenciesList.length < 1) {
            Currency.Data.getLatestRates().then(function (data) {
                downloadedRates = JSON.parse(data.responseText);
                var currencyManipulator = new Currency.Utilities.CurrencyAction(downloadedRates);
                bindRatesDto(currencyManipulator);
            });
        }
    }

    var getCurrenciesNames = function () {
        return Currency.Data.getCurrencies();
    }

    var changeBaseCurrency = function (currencyCode) {
        if (downloadedRates) {
            var currencyManipulator = new Currency.Utilities.CurrencyAction(downloadedRates);
            currencyManipulator.changeBaseCurrency(currencyCode);
            var settings = Currency.Data.getSettings();
            settings.baseCurrency = currencyCode;
            Currency.Data.setSettings(settings);
            bindRatesDto(currencyManipulator);
            Currency.HomeCodeBehind.setLongTitle();
        }
    }

    var bindRatesDto = function (currencyManipulator) {
        var settings = Currency.Data.getSettings();

        currencyDTOs = currencyManipulator.getRatesTable(settings.visible);

        var currentCount = currenciesList.dataSource.list.length
        currenciesList.dataSource.list.splice(0, currentCount);

        for (var i = 0; i < currencyDTOs.length; i++) {
            currenciesList.push(currencyDTOs[i]);
        }

    }

    var loadMonthBackData = function (optionsForRequest) {
        var options = {};
        options.command = "getCurrencyForPeriod";
        options.query = "from=" + optionsForRequest.from + "&till=" + optionsForRequest.till
                        + "&base=" + optionsForRequest.base + "&currency=" + optionsForRequest.currency;
        return Currency.Data.getMonthBackData(options);
    }

    var getCollectionOfDtos = function (arrayOfCurrenciesCodes) {
        var selectedDtos = [];
        var i, j;
        for (i = 0; i < arrayOfCurrenciesCodes.length; i++) {
            for (j = 0; j < currencyDTOs.length; j++) {
                if (arrayOfCurrenciesCodes[i] === currencyDTOs[j].currency) {
                    selectedDtos.push(currencyDTOs[j].currency);
                    break;
                }
            }
        }

        return selectedDtos;
    }


    WinJS.Namespace.define("Currency.ViewModels", {
        loadLatestRates: loadLatestRates,
        currencies: currenciesList,
        getCurrenciesNames: getCurrenciesNames,
        getGlobalSettings: getGlobalSettings,
        changeBaseCurrency: changeBaseCurrency,
        loadMonthBackData: loadMonthBackData,
        getCollectionOfDtos: getCollectionOfDtos
    });
})();