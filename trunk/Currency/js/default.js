/// <reference path="defaultSettings.js" />
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var appModel = Windows.ApplicationModel;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;
    var searchPane = appModel.Search.SearchPane.getForCurrentView();

    app.onerror = function (customEventObject) {
        var errorMessage = '';
        var errorName = '';
        if (customEventObject.detail.error) {
            errorMessage = customEventObject.detail.error.message;
            errorName = customEventObject.detail.error.name;
        }
        else {
            errorMessage = customEventObject.detail.exception.message;
            errorName = 'Exception';
        }
        var optionsObject = { errName: errorName, errMsg: errorMessage };
        Currency.Utilities.showMessage(errorMessage);
        //nav.navigate("/pages/error/error.html", optionsObject);
        return true;
    }

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {

            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }

            args.setPromise(WinJS.UI.processAll().then(function () {
                var baseCurrencyBtn = document.getElementById("baseCurrency").winControl;
                var historicalBtn = document.getElementById("historical").winControl;
                var baseCurrencyMenu = document.getElementById("baseCurrencyMenu").winControl;
                var baseCurrencySelect = document.getElementById("baseCurrencySelect");
                var historicalDataMenu = document.getElementById("historicalDataMenu").winControl;
                var calcBtn = document.getElementById("calc").winControl;
                var calcBody = document.getElementById("calcBody").winControl;
                var fromCyrrencySelect = document.getElementById("fromCurrencySelect");
                var toCyrrencySelect = document.getElementById("toCurrencySelect");
                var filterBtn = document.getElementById("filter").winControl;
                var filterMenu = document.getElementById("filterMenu").winControl;
                var calculateBtn = document.getElementById("calculateBtn");
                var calcAmount = document.getElementById("calcAmount");
                var appBar = document.getElementById("appbar").winControl;
                var historicalDataBtn = document.getElementById("getHistoricalData");
                var historicalDate = document.getElementById("historicalDate").winControl;
                var latestRatesBtn = document.getElementById("latest").winControl;
                var exportToFileBtn = document.getElementById("file-exporter").winControl;


                Currency.DefaultCodeBehind.setBaseCurrencySelect(baseCurrencySelect);
                Currency.DefaultCodeBehind.setFromCurrencySelect(fromCyrrencySelect);
                Currency.DefaultCodeBehind.setToCurrencySelect(toCyrrencySelect);

                baseCurrencyBtn.addEventListener("click", function () {
                    baseCurrencyMenu.show();
                });

                baseCurrencySelect.addEventListener("change", function (event) {
                    baseCurrencyMenu.hide();
                    Currency.ViewModels.changeBaseCurrency(event);
                });

                historicalBtn.addEventListener("click", function () {
                    historicalDataMenu.show();
                });

                calcAmount.addEventListener("focus", function (event) {
                    this.select();
                });

                calcBody.addEventListener("aftershow", function () {
                    calcAmount.focus();
                });

                appBar.addEventListener("aftershow", function () {
                    searchPane.showOnKeyboardInput = false;
                });

                appBar.addEventListener("afterhide", function () {
                    searchPane.showOnKeyboardInput = true;
                });

                calcBtn.addEventListener("click", function () {
                    calcBody.show();
                });

                filterBtn.addEventListener("click", function () {
                    filterMenu.show();
                });

                calculateBtn.addEventListener("click", function () {
                    Currency.DefaultCodeBehind.calculate(calcAmount, fromCyrrencySelect, toCyrrencySelect);
                });

                historicalDataBtn.addEventListener("click", function () {
                    if (Currency.DefaultCodeBehind.getHistoricalData(historicalDate.current)) {
                        latestRatesBtn.disabled = false;
                        historicalBtn.disabled = true;
                    }

                    historicalDataMenu.hide();
                });

                latestRatesBtn.addEventListener("click", function () {
                    Currency.DefaultCodeBehind.backToLatest();
                    latestRatesBtn.disabled = true;
                    historicalBtn.disabled = false;
                });

                exportToFileBtn.addEventListener("click", function () {
                    Currency.DefaultCodeBehind.saveDataToFile();
                });

                WinJS.Application.onsettings = function (e) {
                    e.detail.applicationcommands = {
                        "privacyPolicy": {
                            title: "Privacy Policy",
                            href: "/pages/settings/privacyPolicy.html"
                        },

                        "preferences": {
                            title: "Preferences",
                            href: "/pages/settings/preferences.html"
                        }
                    };

                    WinJS.UI.SettingsFlyout.populateSettings(e);
                };

                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }));
        }
    });

    app.oncheckpoint = function (args) {
        app.sessionState.history = nav.history;
    };

    app.start();
})();
