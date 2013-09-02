/// <reference path="../home/homeCodeBehind.js" />
/// <reference path="../../js/chart.js" />
// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/detailpage/detailpage.html", {
        ready: function (element, options) {
            this.historicalData.then(function (data) {
                var context = document.getElementById("currency-chart").getContext("2d");
                var responseData = JSON.parse(data.responseText);
                var chartData = {
                    labels: [],
                    datasets: [{
                        fillColor: "rgba(220,220,220,0.5)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        data: []
                    }]
                }

                var i;
                for (var date in responseData) {
                    chartData.labels.push(date.toString());
                    chartData.datasets[0].data.push(1/Number(responseData[date]));
                }
                var chart = new Chart.drawer(context).Line(chartData, {
                });
            },function(error){
                console.log(error);
            })
        },
        init: function (element, options) {
            var element = Currency.ViewModels.currencies.getAt(options.indexInRatesList);
            var optionsForRequest = {};
            optionsForRequest.base = Currency.ViewModels.getGlobalSettings().baseCurrency;
            optionsForRequest.currency = element.currency;
            var from = new Date();
            optionsForRequest.till = formatDate(new Date());
            var currentMonth = from.getMonth();
            from.setMonth(currentMonth - 1);
            optionsForRequest.from = formatDate(from);

            this.historicalData = Currency.DetailCodeBehind.getMonthBackData(optionsForRequest);
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
