(function () {
    var RatesModel = WinJS.Class.define(function (currency, amount, rate, invert, flag) {
        this.currency = currency;
        this.amount = amount;
        this.rate = rate;
        this.invert = invert,
        this.flag = flag;
    }, {
        currency: "",
        amount: "",
        rate: "",
        invert: "",
        flag: ""
    })

    WinJS.Namespace.define("Currency.Models", {
        RatesModel: RatesModel
    })
}());