/// <reference path="default.js" />
(function () {
    var baseCurrencySelect;

    var setBaseCurrencySelect = function (element) {
        baseCurrencySelect = element;
    }

    var getBaseCurrencySelect = function () {
        return baseCurrencySelect;
    }

    WinJS.Namespace.define("Currency.DefaultCodeBehind", {
        setBaseCurrencySelect: setBaseCurrencySelect,
        getBaseCurrencySelect: getBaseCurrencySelect
    })
}());