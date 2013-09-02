﻿/// <reference path="../data.js" />
(function () {
    var currenciesList = new WinJS.Binding.List([]);
    var currencyDTOs;
    var downloadedRates;
    var currenciesNames;

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
        if (!currenciesNames) {
            currenciesNames = Currency.Data.getCurrencies();
        }
        
        return currenciesNames;
    }

    var changeBaseCurrency = function (event) {
        if (downloadedRates) {
            var currencyCode = event.target.options[event.target.selectedIndex].value;
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
        for (i = 0; i < 3; i++) {
            for (j = 0; j < currencyDTOs.length; j++) {
                if (arrayOfCurrenciesCodes[i] === currencyDTOs[j].currency) {
                    selectedDtos.push(currencyDTOs[j]);
                    break;
                }
            }
        }

        return selectedDtos;
    }

    var getdownloadedRates = function () {
        if (downloadedRates) {
            return downloadedRates;
        }
    }


    WinJS.Namespace.define("Currency.ViewModels", {
        loadLatestRates: loadLatestRates,
        currencies: currenciesList,
        getCurrenciesNames: getCurrenciesNames,
        getGlobalSettings: getGlobalSettings,
        changeBaseCurrency: changeBaseCurrency,
        loadMonthBackData: loadMonthBackData,
        getCollectionOfDtos: getCollectionOfDtos,
        getdownloadedRates: getdownloadedRates
    });
})();