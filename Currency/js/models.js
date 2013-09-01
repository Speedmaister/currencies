(function () {
    var RatesModel = WinJS.Class.define(function (currency, ammount, rate, invert, flag) {
        this.currency = currency;
        this.ammount = ammount;
        this.rate = rate;
        this.invert = invert,
        this.flag = flag;
    }, {
        currency: "",
        ammount: "",
        rate: "",
        invert: "",
        flag: ""
    })

    WinJS.Namespace.define("Currency.Models", {
        RatesModel: RatesModel
    })
}());