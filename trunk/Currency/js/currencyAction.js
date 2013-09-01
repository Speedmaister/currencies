/// <reference path="codeConverter.js" />
WinJS.Namespace.define("Currency.Utilities", {
    CurrencyAction: WinJS.Class.define(function (downloadedRates) {
        this.baseCurrency = downloadedRates.base;
        this.rates = downloadedRates.rates;
    }, {
        changeBaseCurrency: function (newBase) {
            var i = 0,
                newRate,
                factor;

            if (this.rates[newBase]) {
                this.baseCurrency = newBase;
                factor = this.rates[this.baseCurrency];
                for (i = 0; i < this.rates.length; i++) {
                    newRate = this.rates[i] / factor;
                    this.rates[i] = newRate;
                }
            } else {
                throw new EventException("Unknown currency!");
            }
        },

        exchange: function (ammount, from, to) {
            var result;

            to = to || this.baseCurrency;

            if (this.rates[from] && this.rates[to]) {
                result = ammount * (this.rates[to] / this.rates[from]);
                return result;
            } else {
                throw new EventException("Unknown currency!");
            }
        },

        crossRate: function (from, to) {
            var result;

            if (this.rates[from] && this.rates[to]) {
                result = this.rates[to] / this.rates[from];
                return result;
            } else {
                throw new EventException("Unknown currency!");
            }
        },

        getRatesTable: function (visible) {
            var ratesTable = new Array(),
                i = 0,
                codeConverter = new Currency.Utilities.CodeConverter();

            var toCountry = codeConverter.createCurrencyToCountry();

            for (i = 0; i < visible.length; i++) {
                var flag = "images/flags/" + toCountry[visible[i]].toLowerCase() + ".svg"
                ratesTable.push({
                    currency: visible[i],
                    rate: 1 / this.rates[visible[i]],
                    invert: this.rates[visible[i]],
                    flag: flag
                });
            }
        }
    })
});