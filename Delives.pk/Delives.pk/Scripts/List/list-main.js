let listConfig = {
    emptyGuid: "00000000-0000-0000-0000-000000000000",
    errorMessage: "Something went wrong",
    successMessage: "Operation Successful",
    totalItems: 10,
    jqXHR: null,
    searchFilters: {
        TypeList: [],
        Cords: null,
        CurrentPage: 0,
        ItemsPerPage: 10,
        SearchTerm: "",
        DistanceFrom: "0",
        DistanceTo: "5",
        Rating: "0",
        IsWeb: true,
        SortOrder: null,
        OrderBy: null
    },
    resetSearchFilters: function () {
        listConfig.searchFilters = {
            TypeList: [],
            Cords: locationConfig.getCoords(),
            CurrentPage: 0,
            ItemsPerPage: 10,
            SearchTerm: "",
            DistanceFrom: 0,
            DistanceTo: 5,
            Rating: "0",
            IsWeb: true,
            SortOrder: null,
            OrderBy: null
        };
    },
    setSearchFilters: function (resetPage = false) {
        var itemTypes = $('.load-filter-types input:checked').map(function () {
            return $(this).val();
        }).toArray();
        if (itemTypes.length < 1) {
            itemTypes = [];
        }
        var itemRating = $('.action-rating-types input:checked').map(function () {
            return $(this).val();
        }).toArray();
        if (itemRating.length < 1) {
            itemRating = "0";
        }
        else {
            itemRating = itemRating[0];
        }
        var distance = $('#range').data('ionRangeSlider').options;
        listConfig.searchFilters = {
            TypeList: itemTypes,
            Cords: locationConfig.getCoords(),
            CurrentPage: resetPage ? 0 : listConfig.searchFilters.CurrentPage,
            ItemsPerPage: 10,
            SearchTerm: $('#searchTerm').val(),
            DistanceFrom: distance.from,
            DistanceTo: distance.to,
            Rating: itemRating,
            IsWeb: true,
            SortOrder: null,
            OrderBy: null
        };
    },
    getListItems: function (recenterMap = false) {
        listConfig.searchFilters.CurrentPage += 1;
        //listConfig.searchFilters.TypeList = 1;
        this.jqXHR = $.ajax({
            method: "POST",
            url: "FetchItemsPartialAsync",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ itemSearchModel: listConfig.searchFilters })
        }).done(function (response) {
            //let data = JSON.parse(response);
            if (response.Success) {
                $(response.Html).insertBefore($('.load_more_bt'));
                if (recenterMap)
                mapConfig.recenterMap(locationConfig.latitude, locationConfig.longitude);
                mapConfig.setMarkersPoint(response.Object);
            }
            else {
                console.log(response.Message);
            }
            //alert("success");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            //alert("error");
            console.log(errorThrown);
        }).always(function () {
            //alert("complete");
        });
    },
    getFilterTypes: function () {
        this.jqXHR = $.ajax({
            method: "POST",
            url: "FetchItemTypesPartialAsync",
            dataType: "html",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ Status: true })
        }).done(function (response) {
            $('.load-filter-types').html(response);
            $('.load-filter-types input.item-type').iCheck({
                checkboxClass: 'icheckbox_square-grey'
            });
               
            //alert("success");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            //alert("error");
            console.log(errorThrown);
        }).always(function () {
            //alert("complete");
        });
    },
    setDistanceFromTo: function (from, to) {
        listConfig.searchFilters.DistanceFrom = from;
        listConfig.searchFilters.DistanceTo = to;
    },
    loadLocationDependentData: function (position) {
        locationConfig.geoLocationSuccess(position);
        listConfig.resetSearchFilters();
        listConfig.getListItems(true);
    }
};


$('#cat_nav').mobileMenu();
$(() => {
    $(function () {
        'use strict';
        $("#range").ionRangeSlider({
            hide_min_max: true,
            keyboard: true,
            min: 0,
            max: 15,
            from: 0,
            to: 5,
            type: 'double',
            step: 1,
            prefix: "Km ",
            grid: true,
            onStart: function (data) {
                // Called right after range slider instance initialised
                listConfig.setDistanceFromTo(data.from, data.to);
            },
            //onChange: function (data) {
            //    // Called every time handle position is changed
            //    listConfig.setDistanceFromTo(data.from, data.to);
            //},
            //onFinish: function (data) {
            //    // Called then action is done and mouse is released
            //    listConfig.setDistanceFromTo(data.from, data.to);
            //},
            //onUpdate: function (data) {
            //    // Called then slider is changed using Update public method
            //    listConfig.setDistanceFromTo(data.from, data.to);
            //}
        });
    });
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('q');
    listConfig.resetSearchFilters();
    listConfig.searchFilters.SearchTerm = myParam;
    listConfig.getFilterTypes();
    //if (locationConfig.coords === null) {
    //    if (locationConfig.checkGeoLocationSupported() && locationConfig.errorCode === null) {
    //        locationConfig.getGeoLocation(listConfig.loadLocationDependentData);
    //    }
    //}
    listConfig.resetSearchFilters();
    listConfig.getListItems(true);
});

$('#performSearch').on('click', () => {
    listConfig.setSearchFilters(true);
    $('#tools').nextAll('div').remove();
    listConfig.getListItems();
});