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

    WinJS.Namespace.define("Currency.DefaultCodeBehind", {
        setBaseCurrencySelect: setBaseCurrencySelect,
        getBaseCurrencySelect: getBaseCurrencySelect,
        setFromCurrencySelect: setFromCurrencySelect,
        getFromCurrencySelect: getFromCurrencySelect,
        getToCurrencySelect: getToCurrencySelect,
        setToCurrencySelect: setToCurrencySelect,
        calculate: calculate
        

    })
}());