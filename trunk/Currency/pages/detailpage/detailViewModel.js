/// <reference path="//Microsoft.WinJS.1.0/js/base.js" />
(function () {
    var collectionOfDtos;
    var bindedDtos = new WinJS.Binding.List([]);

    var getCollectionOfDtos = function () {
        bindedDtos.dataSource.list.splice(0, bindedDtos.length);
        var mainCurrencies = Currency.ViewModels.getGlobalSettings().mainCurrencies;
        collectionOfDtos = Currency.ViewModels.getCollectionOfDtos(mainCurrencies);

        var i;
        for (i = 0; i < collectionOfDtos.length; i++) {
            bindedDtos.push(WinJS.Binding.as(collectionOfDtos[i]));
        }
    }

    WinJS.Namespace.define("Currency.DetailCodeBehind.ViewModels", {
        getCollectionOfDtos: getCollectionOfDtos,
        collectionOfDtos: bindedDtos
    })
})();