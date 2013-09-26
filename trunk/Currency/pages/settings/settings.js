/// <reference path="//Microsoft.WinJS.1.0/js/base.js" />
/// <reference path="../../js/viewmodels/settingsViewModel.js" />
(function () {
    WinJS.UI.Pages.define("/pages/settings/preferences.html", {
        ready: function (element, options) {
            var settingsBaseCurrencySelect = document.getElementById("settingsBaseCurrencySelect");
            var settingsCrossRateSelect = document.getElementById("settingsCrossRateSelect");
            
            var settingsAdd = document.getElementById("settingsAdd");
            var settingsDelete = document.getElementById("settingsDelete");
            var settingsSave = document.getElementById("settingsSave");
            var preferences = document.getElementById("preferences").winControl;

            var listView = document.getElementById("preferences-list").winControl;

            Currency.HomeCodeBehind.populateCurrencySelect(settingsBaseCurrencySelect);
            Currency.HomeCodeBehind.populateCurrencySelect(settingsCrossRateSelect);

            WinJS.Resources.processAll();

            settingsAdd.addEventListener("click", function () {
                Currency.Settings.ViewModels.addCurrencyToList(settingsCrossRateSelect);
            });

            settingsDelete.addEventListener("click", function () {
                if (listView.selection._selected) {
                    var selection = listView.selection.getIndices();
                    if (selection.length > 0) {
                        Currency.Settings.ViewModels.deleteFromCurrencyList(selection);
                    } else {
                        Currency.Utilities.showMessage("No currencies are selected!");
                    }
                }

                
            });

            settingsSave.addEventListener("click", function () {
                Currency.Settings.ViewModels.saveSettings(settingsBaseCurrencySelect);
                preferences.hide();
            });
        },

        init: function (element, options) {
            Currency.Settings.ViewModels.initialiseSettings();
        }
    });
})();