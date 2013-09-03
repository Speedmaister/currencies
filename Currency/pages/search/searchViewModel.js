/// <reference path="//Microsoft.WinJS.1.0/js/base.js" />
(function () {
    var searchedList = Currency.ViewModels.currencies;
    var searchQuery;

    var filteredComputers = searchedList.createFiltered(filter);

    function filter(item) {
        if (searchQuery) {
            var isMatched = false;
            var i;
            for (i = 0; i < searchQuery.length; i++) {
                var queryWord = searchQuery[i];
                if (isContained(item.currency, word) > -1
                    || isContained(item.rate, word)
                    || isContained(item.invert, word)
                    || isContained(item.date, word)) {
                    isMatched = true;
                    break;
                }
            }

            return isMatched;
        }

        return true;
    }

    function isContained(property, word) {
        return property.toString().indexOf(word) > -1;
    }

    function submitSearchText(queryText) {
        searchQuery = queryText.split(/[\s,()?!+]/i);
        searchResultList.notifyReload();
    }

    WinJS.Namespace.define("Currency.Search.ViewModels", {
        submitSearchText: submitSearchText,
        currencies: searchedList,
        resultList: filteredComputers,
        filter:filter
    });
})();

/*WinJS.Binding.processAll(element, ViewModels);
            Currency.Search.ViewModels.submitSearchText(options.queryText);*/