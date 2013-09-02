/// <reference path="../../js/chart.js" />
// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/detailpage/detailpage.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
           

            },
        //getCurrencyFromPeriod
        init: function (element, options) {
            // TODO Return WinJS.Promise of the history data of the current element.
            var element = Currency.ViewModels.currencies.getAt(options.indexInRatesList);
            var optionsForRequest = {};
            optionsForRequest.base = Currency.ViewModels.getGlobalSettings().baseCurrency;
            optionsForRequest.currency = element.currency;
            optionsForRequest.from = new Date();
            optionsForRequest.till = new Date();
            var currentMonth = from.getMonth();
            optionsForRequest.from.setMonth(currentMonth - 1);



            var context = document.getElementById("currency-chart").getContext("2d");
            var data = {
                labels: ["02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02", "02.02"],
                datasets: [
                    {
                        fillColor: "rgba(220,220,220,0.5)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        data: [65, 59, 90, 81, 56, 55, 40, 30, 40, 65, 65, 59, 90, 81, 56, 55, 40, 30, 40, 65, 65, 59, 90, 81, 56, 55, 40, 30, 40, 65]
                    }
                ]
            }

            var chart = new Chart.drawer(context).Line(data, {});


        },
        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });

    function formatDate(date) {
        var dateStr = padStr(date.getFullYear()) + "-" +
                padStr(1 + date.getMonth()) + "-" +
                padStr(date.getDate());
        return dateStr;
    }

    function padStr(i) {
        return (i < 10) ? "0" + i : "" + i;
    }

})();
