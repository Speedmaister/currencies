(function () {
    function getMonthBackData(optionsForRequest) {
        return Currency.ViewModels.loadMonthBackData(optionsForRequest);
    }

    WinJS.Namespace.define("Currency.DetailCodeBehind", {
        getMonthBackData: getMonthBackData
    })
}());