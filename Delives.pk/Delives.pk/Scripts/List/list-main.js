let listConfig = {
    emptyGuid: "00000000-0000-0000-0000-000000000000",
    errorMessage: "Something went wrong",
    successMessage: "Operation Successful",
    totalItems: 10,
    jqXHR: null,
    searchFilters: {
        Type: 1,
        Cords: "32.22982263_74.18175494",
        CurrentPage: 1,
        ItemsPerPage: 10,
        SearchTerm: ""
    },
    resetSearchFilters: function () {
        searchFilters = {
            Type: 1,
            Cords: "32.22982263_74.18175494",
            CurrentPage: 1,
            ItemsPerPage: 10,
            SearchTerm: ""
        };
    },
    getListItems: function () {
        listConfig.searchFilters.CurrentPage += 1;
        this.jqXHR = $.ajax({
            method: "POST",
            url: "FetchItemsPartialAsync",
            dataType: "html",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ itemSearchModel: listConfig.searchFilters })
        }).done(function (response) {
            $(response).insertBefore($('.load_more_bt'));
            //alert("success");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            //alert("error");
        }).always(function () {
            //alert("complete");
        });
    }
};
$(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('q');
    listConfig.resetSearchFilters();
    listConfig.searchFilters.SearchTerm = myParam;
});