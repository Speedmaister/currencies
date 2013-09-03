/// <reference path="//Microsoft.WinJS.1.0/js/base.js" />
/// <reference path="../../js/currencyAction.js" />
(function () {
    var collectionOfDtos;
    var bindedDtos = new WinJS.Binding.List([]);

    var getCollectionOfDtos = function (currentCurrency) {
        var rates = Currency.ViewModels.getdownloadedRates();
        var currencyAction = new Currency.Utilities.CurrencyAction(rates);
        bindedDtos.dataSource.list.splice(0, bindedDtos.length);
        var mainCurrencies = Currency.ViewModels.getGlobalSettings().mainCurrencies;
        collectionOfDtos = Currency.ViewModels.getCollectionOfDtos(mainCurrencies);
        var i;
        for (i = 0; i < collectionOfDtos.length; i++) {
            collectionOfDtos[i].rate = currencyAction.exchange(currentCurrency.amount, currentCurrency.currency, collectionOfDtos[i].currency).toFixed(4);
            collectionOfDtos[i].invert = (currentCurrency.amount / collectionOfDtos[i].rate).toFixed(4);
            collectionOfDtos[i].amount = currentCurrency.amount;
            bindedDtos.push(WinJS.Binding.as(collectionOfDtos[i]));
        }
    }

    var getCurrencyFullName = function (currentCurrency,title) {
        Currency.ViewModels.getCurrenciesNames().then(function (data) {
            var currencyNames = JSON.parse(data.responseText);
            title.innerText = "Details for " + currencyNames[currentCurrency.currency];
        });
    }

    WinJS.Namespace.define("Currency.DetailCodeBehind.ViewModels", {
        getCurrencyFullName:getCurrencyFullName,
        getCollectionOfDtos: getCollectionOfDtos,
        collectionOfDtos: bindedDtos
    })
})();