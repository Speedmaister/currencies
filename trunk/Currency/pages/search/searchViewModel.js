/// <reference path="//Microsoft.WinJS.1.0/js/base.js" />
(function () {
    var searchedList = Currency.ViewModels.currencies;
    var searchQuery;
    var queriesJoines = WinJS.Binding.as({ string: "" });

    var filteredComputers = searchedList.createFiltered(filter);

    function filter(item) {
        if (searchQuery) {
            var isMatched = false;
            var i;
            for (i = 0; i < searchQuery.length; i++) {
                var queryWord = searchQuery[i].toLowerCase();
                if (isContained(item.currency, queryWord)
                    || isContained(item.rate, queryWord)
                    || isContained(item.invert, queryWord)
                    || isContained(item.date, queryWord)) {
                    isMatched = true;
                    break;
                }
            }

            return isMatched;
        }

        return true;
    }

    function isContained(property, word) {
        var isContained = property.toString().toLowerCase().indexOf(word) > -1;
        return isContained;
    }

    function submitSearchText(queryText) {
        searchQuery = queryText.split(/[\s,()?!+]/i);
        queriesJoines.string = searchQuery.join(", ");
        searchedList.notifyReload();
    }

    WinJS.Namespace.define("Currency.Search.ViewModels", {
        submitSearchText: submitSearchText,
        currencies: searchedList,
        resultList: filteredComputers,
        filter: filter,
        searchQuery: queriesJoines
    });
})();