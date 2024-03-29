﻿/// <reference path="../data.js" />
(function () {
    var currenciesList = new WinJS.Binding.List([]);
    var currencyDTOs;
    var downloadedRates;
    var currenciesNames;
    var currentDate;

    var tempFolder = Windows.Storage.ApplicationData.current.temporaryFolder;

    var getGlobalSettings = function () {
        return Currency.Data.getSettings();
    }

    var loadLatestRates = function () {
        if (currenciesList.length < 1) {
            Currency.Data.getLatestRates().then(function (data) {
                downloadedRates = JSON.parse(data.responseText);
                var currencyManipulator = new Currency.Utilities.CurrencyAction(downloadedRates);
                bindRatesDto(currencyManipulator);
                var currentDate = new Date(downloadedRates.timestamp * 1000);
                Currency.HomeCodeBehind.setCurrentDate(currentDate);
            }).done(null, function (error) {
                Currency.Utilities.showMessage(WinJS.Resources.getString('NoConnectionMessage').value);
            });
        }
    }

    var loadHistorical = function (date) {
        Currency.Data.getHistoricalRates(date).then(function (data) {
            downloadedRates = JSON.parse(data.responseText);
            var currencyManipulator = new Currency.Utilities.CurrencyAction(downloadedRates);
            bindRatesDto(currencyManipulator);
            currentDate = new Date(date.toDateString());
            Currency.HomeCodeBehind.setCurrentDate(currentDate);
        }, function (error) {
            Currency.Utilities.showMessage(WinJS.Resources.getString('NoConnectionMessage').value);
        });
    }

    var backToLatest = function () {
        Currency.Data.getLatestRates().then(function (data) {
            downloadedRates = JSON.parse(data.responseText);
            var currencyManipulator = new Currency.Utilities.CurrencyAction(downloadedRates);
            bindRatesDto(currencyManipulator);
            var currentDate = new Date(downloadedRates.timestamp * 1000);
            Currency.HomeCodeBehind.setCurrentDate(currentDate);
        }, function (error) {
            Currency.Utilities.showMessage(WinJS.Resources.getString('NoConnectionMessage').value);
        });
    }

    var showFiltered = function () {
        var currencyManipulator = new Currency.Utilities.CurrencyAction(downloadedRates);
        bindRatesDto(currencyManipulator);
    }

    var getCurrenciesNames = function () {
        if (!currenciesNames) {
            currenciesNames = Currency.Data.getCurrencies();
        }

        return currenciesNames;
    }

    var changeBaseCurrency = function (currencyCode) {
        if (downloadedRates) {
            
            var currencyManipulator = new Currency.Utilities.CurrencyAction(downloadedRates);
            currencyManipulator.changeBaseCurrency(currencyCode);
            var settings = Currency.Data.getSettings();
            settings.baseCurrency = currencyCode;
            Currency.Data.setSettings(settings);
            Currency.HomeCodeBehind.setCurrentDate(new Date(downloadedRates.timestamp * 1000));
            bindRatesDto(currencyManipulator);
            Currency.HomeCodeBehind.setLongTitle();
        }
    }

    var bindRatesDto = function (currencyManipulator) {
        var settings = Currency.Data.getSettings();

        currencyDTOs = currencyManipulator.getRatesTable(settings.visible);
        currentDate = currencyDTOs[0].date;

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

    var getCollectionOfDtos = function (arrayOfCurrenciesCodes, currencyManipulator) {
        var settings = getGlobalSettings();
        var neededCurrencyDTOs = currencyManipulator.getRatesTable(settings.allCurrencies);
        var selectedDtos = [];
        var i, j;
        for (i = 0; i < arrayOfCurrenciesCodes.length; i++) { //
            for (j = 0; j < neededCurrencyDTOs.length; j++) {
                if (arrayOfCurrenciesCodes[i] === neededCurrencyDTOs[j].currency) {
                    selectedDtos.push(neededCurrencyDTOs[j]);
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

    var getCurrentDate = function () {
        if (currentDate) {
            return new Date(currentDate.toDateString());
        }
    }

    function shareFileHandler(event) {
        var dataRequest = event.request;

        dataRequest.data.properties.title = "Rates table for all currencies.";
        dataRequest.data.properties.description = "Get all currency rates from the database for the selected date.";

        dataRequest.data.properties.fileTypes.replaceAll([".csv"]);

        var deferral = dataRequest.getDeferral();
        var file = tempFolder.createFileAsync(getCurrentDate().toDateString() + "-rates-table.csv", Windows.Storage.CreationCollisionOption.replaceExisting)
            .then(function (createdFile) {
                Windows.Storage.FileIO.writeTextAsync(createdFile, getData()).done(function () {
                    dataRequest.data.setStorageItems([createdFile]);
                    deferral.complete();
                }, function (error) {
                    deferral.complete();
                });
            }, function (error) {
                deferral.complete();
            });
    }

    function getData() {
        var rates = getdownloadedRates();
        var currencyAction = new Currency.Utilities.CurrencyAction(rates);
        var settings = getGlobalSettings();
        var ratesTable = currencyAction.getRatesTable(settings.visible);
        var dataToString = "Currency,Rate\n";
        var i;
        for (i = 0; i < ratesTable.length; i++) {
            dataToString = dataToString + ratesTable[i].currency + "," + ratesTable[i].rate + "\n";
        }

        return dataToString;
    }

    WinJS.Namespace.define("Currency.ViewModels", {
        getData: getData,
        shareFileHandler: shareFileHandler,
        loadLatestRates: loadLatestRates,
        currencies: currenciesList,
        getCurrenciesNames: getCurrenciesNames,
        getGlobalSettings: getGlobalSettings,
        changeBaseCurrency: changeBaseCurrency,
        loadMonthBackData: loadMonthBackData,
        getCollectionOfDtos: getCollectionOfDtos,
        getdownloadedRates: getdownloadedRates,
        getCurrentDate: getCurrentDate,
        loadHistorical: loadHistorical,
        backToLatest: backToLatest,
        showFiltered: showFiltered
    });
})();