/// <reference path="detailViewModel.js" />
/// <reference path="../../js/viewmodels/homeViewmodel.js" />
(function () {
    var currentCurrency;
    function getMonthBackData(optionsForRequest) {
        return Currency.ViewModels.loadMonthBackData(optionsForRequest);
    }

    function drawData(data, dtoObject) {
        currentCurrency = dtoObject;
        var context = document.getElementById("currency-chart").getContext("2d");
        var divContainer = document.getElementById("currency-history");
        var tableOfData = divContainer.childNodes[3].childNodes[1];
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

        for (var date in responseData) {
            var formatedDate = formateReceivedDate(date);
            var rate = formatRate(responseData[date]);
            addRowToTable(tableOfData, formatedDate, rate.toFixed(4));
            chartData.labels.push(formatedDate);
            chartData.datasets[0].data.push(rate);
        }

        var options ={
            scaleFontColor: "#FFF"
        }

        checkValues(chartData.datasets[0].data, options);

        var chart = new Chart.drawer(context).Line(chartData, options);

        Currency.DetailCodeBehind.ViewModels.getCollectionOfDtos(currentCurrency);
    }

    function checkValues(data, options) {
        var areEqual = true;
        var i;
        for (i = 0; i < data.length - 1; i++) {
            if (data[i] !== data[i + 1]) {
                areEqual = false;
                break;
            }
        }

        if (areEqual) {
            options.scaleOverride = true;
            options.scaleSteps = 10;
            var stepWidth = data[0]/10;
            options.scaleStepWidth = stepWidth;
            options.scaleStartValue = data[0] - 5 * stepWidth;
        }
    }

    function formateReceivedDate(date) {
        var lastSlashIndex = date.lastIndexOf("-");
        var day = date.substring(lastSlashIndex + 1, date.length);
        var firstSlashIndex = date.indexOf("-");
        var month = date.substring(firstSlashIndex + 1, lastSlashIndex);
        return day + "." + month;
    }

    function formatRate(rateUnformated) {
        var numerator = rateUnformated.split(".")[0];
        var amount = 1;

        if (numerator.length > 1) {
            amount = Math.pow(10, numerator.length);
        } else if (numerator.length === 1 && numerator > "1") {
            amount = 10;
        }

        var rateFormated = (Number(amount / rateUnformated));
        return rateFormated;
    }

    function addHeadersToTable(table) {
        var tr = document.createElement("tr");
        var thDate = document.createElement("th");
        thDate.classList.add("date-cell");
        thDate.innerText = "Date";
        var thRate = document.createElement("th");
        thRate.classList.add("rate-cell");
        thRate.innerText = "Rate";
        tr.appendChild(thDate);
        tr.appendChild(thRate);
        table.appendChild(tr);
    }

    function addRowToTable(table,date, rate) {
        var tr = document.createElement("tr");
        var tdDate = document.createElement("td");
        tdDate.classList.add("date-cell");
        tdDate.innerText = date;
        var tdRate = document.createElement("td");
        tdRate.classList.add("rate-cell");
        tdRate.innerText = rate;
        tr.appendChild(tdDate);
        tr.appendChild(tdRate);
        table.appendChild(tr);
    }

    WinJS.Namespace.define("Currency.DetailCodeBehind", {
        getMonthBackData: getMonthBackData,
        drawData: drawData
    })
}());