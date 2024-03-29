﻿/// <reference path="defaultSettings.js" />
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
        var errorStack = '';
        if (customEventObject.detail.error) {
            errorMessage = customEventObject.detail.error.message;
            errorName = customEventObject.detail.error.name;
            errorStack = customEventObject.detail.error.stack;
        }
        else {
            if (customEventObject.detail.exception.stack) {
                errorStack = customEventObject.detail.exception.stack;
            }
            errorMessage = customEventObject.detail.exception.message;
            errorName = 'Exception';
        }

        var optionsObject = { errName: errorName, errMsg: errorMessage, navHistory: nav.history, errStack: errorStack };
        Currency.Utilities.errorReport(optionsObject);
        //nav.navigate("/pages/error/error.html", optionsObject);
        return true;
    }

    app.addEventListener("activated", function (args) {
        //if (args.detail.kind === activation.ActivationKind.search) {
        //    Currency.Data.initSettings().then(function () {
        //        Currency.HomeCodeBehind.callLoadLatestRates();
        //    });
        //}
        if (args.detail.kind === activation.ActivationKind.launch || args.detail.kind === activation.ActivationKind.search) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {

            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            Currency.Data.initSettings().then(function () {
                Currency.HomeCodeBehind.callLoadLatestRates();
            });

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

                WinJS.Resources.processAll();

                Currency.DefaultCodeBehind.setBaseCurrencySelect(baseCurrencySelect);
                Currency.DefaultCodeBehind.setFromCurrencySelect(fromCyrrencySelect);
                Currency.DefaultCodeBehind.setToCurrencySelect(toCyrrencySelect);
                var maxYear = new Date().getFullYear();
                historicalDate.maxYear = maxYear;

                baseCurrencyBtn.addEventListener("click", function () {
                    baseCurrencyMenu.show();
                });

                baseCurrencySelect.addEventListener("change", function (event) {
                    baseCurrencyMenu.hide();
                    var currencyCode = event.target.options[event.target.selectedIndex].value;
                    Currency.ViewModels.changeBaseCurrency(currencyCode);
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
                            title: WinJS.Resources.getString('PrivacyPolicyTitle').value,
                            href: "/pages/settings/privacy.html"
                        },

                        "preferences": {
                            title: WinJS.Resources.getString('PreferencesTitle').value,
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
