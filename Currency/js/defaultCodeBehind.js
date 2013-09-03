/// <reference path="default.js" />
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

    WinJS.Namespace.define("Currency.DefaultCodeBehind", {
        setBaseCurrencySelect: setBaseCurrencySelect,
        getBaseCurrencySelect: getBaseCurrencySelect,
        setFromCurrencySelect: setFromCurrencySelect,
        getFromCurrencySelect: getFromCurrencySelect,
        getToCurrencySelect: getToCurrencySelect,
        setToCurrencySelect: setToCurrencySelect
        

    })
}());