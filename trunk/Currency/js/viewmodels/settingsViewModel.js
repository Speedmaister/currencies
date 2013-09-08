/// <reference path="//Microsoft.WinJS.1.0/js/base.js" />
(function () {
    var settings;
    var codeList = new WinJS.Binding.List([]);
    var codeDTO;

    var initialiseSettings = function () {
        if (codeList.dataSource.list.length > 1) {
            cleanBindedList();
        }

        Currency.ViewModels.getCurrenciesNames().then(function (data) {
            currencies = JSON.parse(data.responseText);
            settings = Currency.ViewModels.getGlobalSettings();
            for (var i = 0; i < settings.mainCurrencies.length; i++) {
                var code = settings.mainCurrencies[i];
                var name = currencies[code];

                codeDTO = new Currency.Models.CrossRateListModel(code, name);
                codeList.push(codeDTO);
            }
        });
    }

    var addCurrencyToList = function (element) {
        var code = element.options[element.selectedIndex].value;
        var name = element.options[element.selectedIndex].label;
        var dto = new Currency.Models.CrossRateListModel(code, name);

        codeList.push(dto);
    }

    var deleteFromCurrencyList = function (selection) {
        var settingsDto = [];
        for (var i = 0; i < codeList.dataSource.list.length; i++) {
            if (!contains(selection, i)) {
                settingsDto.push(codeList.getAt(i));
            }
        }

        cleanBindedList();
        for (var i = 0; i < settingsDto.length; i++) {
            codeList.push(settingsDto[i]);
        }
    }

    var contains = function (arr, value) {
        return arr.indexOf(value) > -1;
    }

    var cleanBindedList = function () {
        var currentCount = codeList.dataSource.list.length
        codeList.dataSource.list.splice(0, currentCount);
    }

    var saveSettings = function (element) {
        var baseCurrency = element.options[element.selectedIndex].value;
        settings.baseCurrency = baseCurrency;
        var main = [];
        for (var i = 0; i < codeList.dataSource.list.length; i++) {
            main.push(codeList.getAt(i).code);
        }

        settings.mainCurrencies = main;

        Currency.Data.setSettings(settings);
        Currency.ViewModels.changeBaseCurrency(settings.baseCurrency);
    }
    

    WinJS.Namespace.define("Currency.Settings.ViewModels", {
        codeList: codeList,
        addCurrencyToList: addCurrencyToList,
        initialiseSettings: initialiseSettings,
        deleteFromCurrencyList: deleteFromCurrencyList,
        saveSettings: saveSettings
    });
})();