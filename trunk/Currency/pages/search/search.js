/// <reference path="//Microsoft.WinJS.1.0/js/base.js" />
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
            var template = document.getElementById("currency-template");
            WinJS.Resources.processAll();
            WinJS.Binding.processAll(element, Currency.Search.ViewModels);
            Currency.Search.ViewModels.submitSearchText(options.queryText);

            document.getElementById("baseCurrency").style.display = "none";
            document.getElementById("historical").style.display = "none";
            document.getElementById("filter").style.display = "none";
            document.getElementById("latest").style.display = "none";
            document.getElementById("file-exporter").style.display = "none";
        },

        updateLayout: function (element, viewState, lastViewState) {
            var searchList = document.getElementById("searchList").winControl;

            if (viewState === Windows.UI.ViewManagement.ApplicationViewState.snapped) {
                if (searchList.layout.horizontal) {
                    searchList.layout = new WinJS.UI.ListLayout();

                }
            }
            else if (!searchList.layout.horizontal) {
                searchList.layout = new WinJS.UI.GridLayout();
            }
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
