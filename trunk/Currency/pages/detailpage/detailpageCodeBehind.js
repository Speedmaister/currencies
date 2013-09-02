﻿(function () {
    function getMonthBackData(optionsForRequest) {
        return Currency.ViewModels.loadMonthBackData(optionsForRequest);
    }

    function drawData(data) {
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

        var i;
        for (i = 0; i < 40; i++) {
            addRowToTable(tableOfData, "01.01", "33.3333");
        }
        for (var date in responseData) {
            var formatedDate = formateReceivedDate(date);
            var rate = formatRate(responseData[date]);
            addRowToTable(tableOfData, formatedDate, rate.toFixed(4));
            chartData.labels.push(formatedDate);
            chartData.datasets[0].data.push(rate);
        }
        var chart = new Chart.drawer(context).Line(chartData, {
            scaleFontColor: "#FFF",
        });
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