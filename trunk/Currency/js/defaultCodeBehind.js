/// <reference path="default.js" />
/// <reference path="currencyAction.js" />
(function () {
    var baseCurrencySelect;
    var fromCurrencySelect;
    var toCurrencySelect;

    var setBaseCurrencySelect = function (element) {
        baseCurrencySelect = element;
    }

    var getBaseCurrencySelect = function () {
        return baseCurrencySelect;
    }

    var setFromCurrencySelect = function (element) {
        fromCurrencySelect = element;
    }

    var getFromCurrencySelect = function () {
        return fromCurrencySelect;
    }

    var setToCurrencySelect = function (element) {
        toCurrencySelect = element;
    }

    var getToCurrencySelect = function () {
        return toCurrencySelect;
    }

    var backToLatest = function () {
        Currency.ViewModels.backToLatest();
    }

    var calculate = function (input, from, to) {
        var amount = input.value;
        var currencyFrom = from.options[from.selectedIndex].value;
        var currencyTo = to.options[to.selectedIndex].value;
        var downloadedRates = Currency.ViewModels.getdownloadedRates();
        var currencyManipulator = new Currency.Utilities.CurrencyAction(downloadedRates);
        var roamingSettings = Windows.Storage.ApplicationData.current.roamingSettings;

        input.value = currencyManipulator.exchange(amount, currencyFrom, currencyTo).toFixed(4) + " " + currencyTo;
        roamingSettings.values['calculatorFrom'] = from.selectedIndex;
        roamingSettings.values['calculatorTo'] = to.selectedIndex;
    }

    var getHistoricalData = function (date) {
        var isSet = true;
        var today = new Date();
        today.setHours(0);
        if (date < today) {
            Currency.ViewModels.loadHistorical(date);
        } else {
            Currency.Utilities.showMessage(WinJS.Resources.getString('PastDaysMessage').value);
            isSet = false;
        }

        return isSet;
    }

    var saveDataToFile = function () {
        var dataToString = Currency.ViewModels.getData();

        var savePicker = new Windows.Storage.Pickers.FileSavePicker();
        savePicker.defaultFileExtension = ".csv"
        savePicker.fileTypeChoices.insert("Comma Seperated Value", [".csv"])
        savePicker.suggestedFileName = "New Rates Table";

        savePicker.pickSaveFileAsync().then(function (file) {
            if (file) {
                Windows.Storage.FileIO.writeTextAsync(file, dataToString)
                    .then(function () {
                        Currency.Utilities.showToast(WinJS.Resources.getString('FileSuccessfulySavedMessage').value);
                    },
                    function () {
                        Currency.Utilities.showToast(WinJS.Resources.getString('FileFailedSaveMessage').value);
                    });
            }
        });
    }

    WinJS.Namespace.define("Currency.DefaultCodeBehind", {
        saveDataToFile: saveDataToFile,
        setBaseCurrencySelect: setBaseCurrencySelect,
        getBaseCurrencySelect: getBaseCurrencySelect,
        setFromCurrencySelect: setFromCurrencySelect,
        getFromCurrencySelect: getFromCurrencySelect,
        getToCurrencySelect: getToCurrencySelect,
        setToCurrencySelect: setToCurrencySelect,
        calculate: calculate,
        getHistoricalData: getHistoricalData,
        backToLatest: backToLatest
    })
}());