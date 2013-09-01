(function () {
    var currenciesList = new WinJS.Binding.List([]);
    var currencyDTOs;
    
    var getGlobalSettings = function () {
        return Currency.Data.getSettings();
    }

    var loadLatestRates = function () {
        Currency.Data.getLatestRates().then(function (data) {
            var downloadedRates = JSON.parse(data.responseText);
            var currencyManipulator = new Currency.Utilities.CurrencyAction(downloadedRates);
            var settings = Currency.Data.getSettings();

            currencyDTOs = currencyManipulator.getRatesTable(settings.visible);

            var currentCount = currenciesList.dataSource.list.length
            currenciesList.dataSource.list.splice(0, currentCount);

            for (var i = 0; i < currencyDTOs.length; i++) {
                currenciesList.push(currencyDTOs[i]);
            }
        });
    }

    var getCurrenciesNames = function () {
        return Currency.Data.getCurrencies();
    }

    WinJS.Namespace.define("Currency.ViewModels", {
        loadLatestRates: loadLatestRates,
        currencies: currenciesList,
        getCurrenciesNames: getCurrenciesNames,
        getGlobalSettings: getGlobalSettings
    });
})();