/// <reference path="//Microsoft.WinJS.1.0/js/base.js" />
/// <reference path="../../js/currencyAction.js" />
(function () {
    var collectionOfDtos;
    var bindedDtos = new WinJS.Binding.List([]);
    var currentElement;
    var tempFolder = Windows.Storage.ApplicationData.current.temporaryFolder;

    var getCollectionOfDtos = function (currentCurrency) {
        currentElement = currentCurrency;
        var rates = Currency.ViewModels.getdownloadedRates();
        var currencyAction = new Currency.Utilities.CurrencyAction(rates);
        bindedDtos.dataSource.list.splice(0, bindedDtos.length);
        var mainCurrencies = Currency.ViewModels.getGlobalSettings().mainCurrencies;
        collectionOfDtos = Currency.ViewModels.getCollectionOfDtos(mainCurrencies);
        var i;
        for (i = 0; i < collectionOfDtos.length; i++) {
            collectionOfDtos[i].rate = currencyAction.exchange(currentCurrency.amount,
                                                                currentCurrency.currency,
                                                                collectionOfDtos[i].currency).toFixed(4);
            collectionOfDtos[i].invert = (currentCurrency.amount / collectionOfDtos[i].rate).toFixed(4);
            collectionOfDtos[i].amount = currentCurrency.amount;
            bindedDtos.push(WinJS.Binding.as(collectionOfDtos[i]));
        }
    }

    var getCurrencyFullName = function (currentCurrency, title) {
        Currency.ViewModels.getCurrenciesNames().then(function (data) {
            var currencyNames = JSON.parse(data.responseText);
            title.innerText = "Details for " + currencyNames[currentCurrency.currency];
        });
    }

    function shareFileHandler(event) {
        var dataRequest = event.request;

        dataRequest.data.properties.title = "Details for " + currentElement.currency;
        dataRequest.data.properties.description = "Get details for one month period of the currency.";

        dataRequest.data.properties.fileTypes.replaceAll([".csv"]);

        var deferral = dataRequest.getDeferral();
        var file = tempFolder.createFileAsync("details-rates.csv", Windows.Storage.CreationCollisionOption.replaceExisting)
            .then(function (createdFile) {
                Windows.Storage.FileIO.writeTextAsync(createdFile, getRates()).then(function () {
                    dataRequest.data.setStorageItems([createdFile]);
                    deferral.complete();
                }, function (error) {
                    deferral.complete();
                });
            }, function (error) {
                Currency.Utilities.showMessage("Problem occured while trying to share file.");
                deferral.complete();
            });
    }

    function getRates() {
        var dataArray = JSON.parse(oneMonthBackData.responseText);
        var svcStringData = "Date,Rate\n";
        var i;
        for (var date in dataArray) {
            svcStringData = svcStringData + Currency.DetailCodeBehind.formateReceivedDate(date)
                + "," + Currency.DetailCodeBehind.formatRate(dataArray[date]) + "\n";
        }

        return svcStringData;
    }

    WinJS.Namespace.define("Currency.DetailCodeBehind.ViewModels", {
        shareFileHandler: shareFileHandler,
        getCurrencyFullName: getCurrencyFullName,
        getCollectionOfDtos: getCollectionOfDtos,
        collectionOfDtos: bindedDtos
    })
})();