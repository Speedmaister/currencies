﻿/// <reference path="//Microsoft.WinJS.1.0/js/base.js" />
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var appModel = Windows.ApplicationModel;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    var searchPageURI = "/pages/search/search.html";
    var searchPane = appModel.Search.SearchPane.getForCurrentView();

    searchPane.placeholderText = "Search for a currency.";
    searchPane.showOnKeyboardInput = true;

    ui.Pages.define(searchPageURI, {
        ready: function (element, options) {
            WinJS.Binding.processAll(element, Currency.Search.ViewModels);
            Currency.Search.ViewModels.submitSearchText(options.queryText);
        }
    });
 
    WinJS.Application.addEventListener("activated", function (args) {
        if (args.detail.kind === appModel.Activation.ActivationKind.search) {
            args.setPromise(ui.processAll().then(function () {
                if (!nav.location) {
                    nav.history.current = { location: Application.navigator.home, initialState: {} };
                }

                return nav.navigate(searchPageURI, { queryText: args.detail.queryText });
            }));
        }
    });

    searchPane.onquerysubmitted = function (args) { nav.navigate(searchPageURI, args); };
})();
