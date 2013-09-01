(function () {

    var goToCurrencyDetailsPage = function (invokeEvent) {
        WinJS.Navigation.navigate("/pages/detailpage/detailpage.html", {
            indexInRatesList: invokeEvent.detail.itemIndex
        });
    }

    WinJS.Utilities.markSupportedForProcessing(goToCurrencyDetailsPage);

    WinJS.Namespace.define("Currency.HomeCodeBehind", {
        callLoadLatestRates: function () {
            Currency.ViewModels.loadLatestRates();
        },

        goToCurrencyDetailsPage: goToCurrencyDetailsPage
    })
}());