/// <reference path="defaultSettings.js" />
// For an introduction to the Navigation template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232506
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;
    var globalSettings;
    var roamingFolder = Windows.Storage.ApplicationData.current.roamingFolder;
    var codeConvertor = new Currency.Utilities.CodeConverter();

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                roamingFolder.getFileAsync("settings.json").then(function (file) {
                    Windows.Storage.FileIO.readTextAsync(file).then(function (text) {
                        globalSettings = JSON.parse(text);
                    });
                }, function () {
                    configureSettings();
                });
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
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

     function configureSettings() {
        var clientInfo = new Currency.Utilities.ClientInfo(),
                        toCurrencyCode = codeConvertor.createCountryToCurrency(),
                        currencyCode;

        globalSettings = defaultSettings.settings;

        clientInfo.getData(function (data) {
            var clientData = JSON.parse(data.responseText);
            currencyCode = toCurrencyCode[clientData.countryCode];
            if (currencyCode) {
                globalSettings.baseCurrency = currencyCode;
            }

            roamingFolder.createFileAsync("settings.json",
            Windows.Storage.CreationCollisionOption.replaceExisting).then(function (file) {
                Windows.Storage.FileIO.writeTextAsync(file, JSON.stringify(globalSettings));
            });
        }, function (message) { });
    }

    app.start();
})();
