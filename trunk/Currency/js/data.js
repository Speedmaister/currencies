/// <reference path="apiRequest.js" />
/// <reference path="currencyAction.js" />
(function () {
    var roamingFolder = Windows.Storage.ApplicationData.current.roamingFolder;
    var globalSettings;
    var requester = new Currency.Utilities.ApiRequest();

    roamingFolder.getFileAsync("settings.json").then(function (file) {
        Windows.Storage.FileIO.readTextAsync(file).then(function (text) {
            globalSettings = JSON.parse(text);
        });
    }, function () {
        configureSettings();
    });

    function configureSettings() {
        var clientInfo = new Currency.Utilities.ClientInfo(),
                        toCurrencyCode = codeConvertor.createCountryToCurrency(),
                        currencyCode;

        globalSettings = defaultSettings.settings;

        clientInfo.getData(function (data) {
            var clientData = JSON.parse(data.responseText);
            currencyCode = toCurrencyCode[clientData.countryCode];
            if (currencyCode) {
                globalSettings.baseCurrency = currencyCode;
            }

            roamingFolder.createFileAsync("settings.json",
            Windows.Storage.CreationCollisionOption.replaceExisting).then(function (file) {
                Windows.Storage.FileIO.writeTextAsync(file, JSON.stringify(globalSettings));
            });
        }, function (message) { });
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

    }

    function setSettings() {

    }

    WinJS.Namespace.define("Currency.Data", {
        getLatestRates: getLatestRates,
        getHistoricalRates: getHistoricalRates,
        getSettings: getSettings,
        setSettings: setSettings
    });
}());