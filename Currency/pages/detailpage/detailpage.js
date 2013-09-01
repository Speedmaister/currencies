/// <reference path="../../js/chart.js" />
// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/detailpage/detailpage.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var context = document.getElementById("currency-chart").getContext("2d");
            var data = {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                    {
                        fillColor: "rgba(220,220,220,0.5)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        data: [65, 59, 90, 81, 56, 55, 40]
                    },
                    {
                        fillColor: "rgba(151,187,205,0.5)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        data: [28, 48, 40, 19, 96, 27, 100]
                    }
                ]
            }

            var chart = new Chart.drawer(context).Line(data, {});

        },

        load: function (uri) {
            return WinJS.UI.Fragments.render(uri).then(function (domElements) {
                console.log(domElements);

                var currentDateTime = new Date();

                var introTextParagraph = WinJS.Utilities.query("#introducing-text", domElements)[0];
                introTextParagraph.innerHTML += " on " + currentDateTime.toLocaleDateString();

                var picHeader = WinJS.Utilities.query("#pic-header", domElements)[0];

                var currHours = currentDateTime.getHours();

                var daytimeString = currHours > 6 && currHours < 18 ? "day" : "night";
                picHeader.innerHTML += " at " + currentDateTime.toLocaleTimeString() + " (" + daytimeString + ")";

                var picCell = WinJS.Utilities.query("#picture-cell", domElements)[0];
                picCell.setAttribute("data-daytime-string", daytimeString);

                return domElements;
            });
            var context = document.getElementById("currency-chart").getContext("2d");
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });
})();
