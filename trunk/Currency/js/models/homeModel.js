(function () {
    var RatesModel = WinJS.Class.define(function (currency, amount, rate, invert, flag, date) {
        this.currency = currency;
        this.amount = amount;
        this.rate = rate;
        this.invert = invert;
        this.flag = flag;
        this.date = date;
    }, {
        currency: "",
        amount: "",
        rate: "",
        invert: "",
        flag: "",
        date: ""
    })

    WinJS.Namespace.define("Currency.Models", {
        RatesModel: RatesModel
    })
}());