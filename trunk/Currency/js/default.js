﻿/// <reference path="defaultSettings.js" />
// For an introduction to the Navigation template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232506
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var appModel = Windows.ApplicationModel;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;
    var searchPane = appModel.Search.SearchPane.getForCurrentView();

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

                Currency.DefaultCodeBehind.setBaseCurrencySelect(baseCurrencySelect);
                Currency.DefaultCodeBehind.setFromCurrencySelect(fromCyrrencySelect);
                Currency.DefaultCodeBehind.setToCurrencySelect(toCyrrencySelect);

                baseCurrencyBtn.addEventListener("click", function () {
                    baseCurrencyMenu.show();
                });

                baseCurrencySelect.addEventListener("change", function (event) {
                    baseCurrencyMenu.hide();
                    //nav.navigate(Application.navigator.home);
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
                    Currency.DefaultCodeBehind.getHistoricalData(historicalDate.current);
                    historicalDataMenu.hide();
                    latestRatesBtn.disabled = false;
                    historicalBtn.disabled = true;
                });

                latestRatesBtn.addEventListener("click", function () {
                    Currency.DefaultCodeBehind.backToLatest();
                    latestRatesBtn.disabled = true;
                    historicalBtn.disabled = false;
                });

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
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };

     

    app.start();
})();
