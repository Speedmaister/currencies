/// <reference path="apiRequest.js" />
/// <reference path="currencyAction.js" />
(function () {
    var roamingFolder = Windows.Storage.ApplicationData.current.roamingFolder;
    var globalSettings;
    var requester = new Currency.Utilities.ApiRequest();
    var codeConverter = new Currency.Utilities.CodeConverter();

    function initSettings() {

        return new WinJS.Promise(function (complete) {
            roamingFolder.getFileAsync("settings.json").then(function (file) {
                Windows.Storage.FileIO.readTextAsync(file).then(function (text) {
                    globalSettings = JSON.parse(text);
                    complete();
                });
            }, function () {
                getCurrencies().then(function (data) {
                    var currencies = JSON.parse(data.responseText);
                    var visible = new Array();

                    for (currencyCode in currencies) {
                        if (currencyCode !== "_id") {
                            visible.push(currencyCode);
                        }
                    }

                    configureSettings(visible, complete);
                }, function () {
                    Currency.Utilities.showMessage("No internet connection.");
                })
            });
        });
    }

    function configureSettings(visible, complete) {
        var clientInfo = new Currency.Utilities.ClientInfo(),
            toCurrencyCode = codeConverter.createCountryToCurrency(),
            currencyCode;

        globalSettings = defaultSettings.settings;
        globalSettings.visible = visible;
        globalSettings.allCurrencies = visible;

        clientInfo.getData().then(function (data) {
            var clientData = JSON.parse(data.responseText);
            currencyCode = toCurrencyCode[clientData.countryCode];
            if (currencyCode) {
                globalSettings.baseCurrency = currencyCode;
            }

            roamingFolder.createFileAsync("settings.json",
            Windows.Storage.CreationCollisionOption.replaceExisting).then(function (file) {
                Windows.Storage.FileIO.writeTextAsync(file, JSON.stringify(globalSettings))
                .then(function () { complete() });
            });
        }, function (message) {
            Currency.Utilities.showMessage("No internet connection.");
        });
    }

    function getCurrencies() {
        var options = {
            command: "getCurrencies"
        }

        return requester.getData(options);
    }

    function getLatestRates() {
        var query = "base=" + globalSettings.baseCurrency;
        var options = {
            command: "getLatest",
            query: query
        }

        return requester.getData(options);
    }

    function getHistoricalRates(date) {
        var dateStr = padStr(date.getFullYear()) + "-" +
                  padStr(1 + date.getMonth()) + "-" +
                  padStr(date.getDate());

        var query = "base=" + globalSettings.baseCurrency + "&date=" + dateStr;
        var options = {
            command: "getHistorical",
            query: query
        }

        return requester.getData(options);
    }

    function padStr(i) {
        return (i < 10) ? "0" + i : "" + i;
    }

    function getSettings() {
        return globalSettings;
    }

    function setSettings(newSettings) {
        globalSettings = newSettings;
        roamingFolder.createFileAsync("settings.json",
            Windows.Storage.CreationCollisionOption.replaceExisting).then(function (file) {
                Windows.Storage.FileIO.writeTextAsync(file, JSON.stringify(globalSettings));
            });
    }

    function getMonthBackData(options) {
        return requester.getData(options);
    }

    WinJS.Namespace.define("Currency.Data", {
        initSettings: initSettings,
        getLatestRates: getLatestRates,
        getHistoricalRates: getHistoricalRates,
        getCurrencies: getCurrencies,
        getSettings: getSettings,
        setSettings: setSettings,
        getMonthBackData:getMonthBackData
    });
}());
