/// <reference path="codeConverter.js" />
WinJS.Namespace.define("Currency.Utilities", {
    CurrencyAction: WinJS.Class.define(function (downloadedRates) {
        this.baseCurrency = downloadedRates.base;
        this.rates = downloadedRates.rates;
        this.date = new Date(downloadedRates.timestamp * 1000);
    }, {
        changeBaseCurrency: function (newBase) {
            var newRate,
                factor;

            if (this.rates[newBase]) {
                this.baseCurrency = newBase;
                factor = this.rates[this.baseCurrency];
                for (var i in this.rates) {
                    newRate = this.rates[i] / factor;
                    this.rates[i] = newRate;
                }
            }
        },

        exchange: function (ammount, from, to) {
            var result;

            to = to || this.baseCurrency;

            if (this.rates[from] && this.rates[to]) {
                result = ammount * (this.rates[to] / this.rates[from]);
                return result;
            }
        },

        crossRate: function (from, to) {
            var result;

            if (this.rates[from] && this.rates[to]) {
                result = this.rates[to] / this.rates[from];
                return result;
            }
        },

        getRatesTable: function (visible) {
            var ratesTable = new Array(),
                i = 0,
                codeConverter = new Currency.Utilities.CodeConverter();

            var toCountry = codeConverter.createCurrencyToCountry();

            for (i = 0; i < visible.length; i++) {
                if (this.rates[visible[i]]) {
                    var flag = "images/flags/" + toCountry[visible[i]].toLowerCase() + ".svg";
                    var numerator = this.rates[visible[i]].toString().split(".")[0];
                    var amount = 1;

                    if (numerator.length > 1) {
                        amount = Math.pow(10, numerator.length);
                    }
                    else if (numerator.length === 1 && numerator > "1") {
                        amount = 10;
                    }

                    var rate = (amount / this.rates[visible[i]]).toFixed(4);
                    var invert = Number(this.rates[visible[i]]).toFixed(4);

                    ratesTable.push(new Currency.Models.RatesModel(visible[i], amount, rate, invert, flag, this.date));
                }
            }

            return ratesTable;
        }
    }),

    showMessage: function (textMessage) {
        var msg = new Windows.UI.Popups.MessageDialog(textMessage);
        msg.showAsync().done();
    },

    errorReport: function (data) {
        var msg = new Windows.UI.Popups.MessageDialog(
            WinJS.Resources.getString('SendErrorReportMessage').value,
            WinJS.Resources.getString('SendErrorReportTitle').value);

        msg.commands.append(new Windows.UI.Popups.UICommand(
           WinJS.Resources.getString('SendErrorReportCommand').value,
           function () {
               Currency.Data.sendErrorReport(data).then(function (data) {
                   var d = data;//TODO: toast notification
               }, function (error) {
                   console.log(error.responseText);
               });
           }));
        msg.commands.append(new Windows.UI.Popups.UICommand(
            WinJS.Resources.getString('CancelErrorReportCommand').value,
            function () { }));

        // Set the command that will be invoked by default
        msg.defaultCommandIndex = 0;

        // Set the command to be invoked when escape is pressed
        msg.cancelCommandIndex = 1;

        // Show the message dialog
        msg.showAsync();
    }
});