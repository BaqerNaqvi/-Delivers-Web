let listConfig = {
    emptyGuid: "00000000-0000-0000-0000-000000000000",
    errorMessage: "Something went wrong",
    successMessage: "Operation Successful",
    totalItems: 10,
    xhrItems: null,
    searchFilters: {
        TypeList: [],
        Cords: null,
        CurrentPage: 0,
        ItemsPerPage: 10,
        SearchTerm: "",
        DistanceFrom: "0",
        DistanceTo: "120",
        Rating: "0",
        IsWeb: true,
        SortOrder: "asc",
        OrderBy: "distance"
    },
    resetSearchFilters: function () {
        listConfig.searchFilters = {
            TypeList: [],
            Cords: locationConfig.getCoords(),
            CurrentPage: 0,
            ItemsPerPage: 10,
            SearchTerm: "",
            DistanceFrom: 0,
            DistanceTo: 120,
            Rating: "0",
            IsWeb: true,
            SortOrder: "asc",
            OrderBy: "distance"
        };
    },
    setSearchFilters: function (resetPage ) {
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
        //var distance = $('#range').data('ionRangeSlider').options;
        listConfig.searchFilters = {
            TypeList: itemTypes,
            Cords: locationConfig.getCoords(),
            CurrentPage: resetPage ? 0 : listConfig.searchFilters.CurrentPage,
            ItemsPerPage: 10,
            SearchTerm: $('#searchTerm').val(),
            DistanceFrom: listConfig.searchFilters.DistanceFrom,
            DistanceTo: listConfig.searchFilters.DistanceTo,
            Rating: itemRating,
            IsWeb: true,
            SortOrder: $("#sort_rating").find(":selected").data("sort-order"),
            OrderBy: $("#sort_rating").find(":selected").data("order-by")
        };
    },
    getListItems: function (recenterMap = false) {

        showProgress() ;
        $('#search-address').text("Please wait")


        listConfig.searchFilters.CurrentPage += 1;
        this.jqXHR = $.ajax({
            method: "POST",
            url: "FetchItemsPartialAsync",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ itemSearchModel: listConfig.searchFilters })
        }).done(function (response) {
            $('#res-result-count').text(localStorage.getItem("search-add"));
            hideProgress();
            $('#search-address').text("")
            //let data = JSON.parse(response);
            if (response.Success) {
                if (response.Status === 404) {
                    $('.load_more_bt').hide();
                    toastr.error(response.Message);
                }
                else {
                    $(response.Html).insertBefore($('.load_more_bt'));
                    if (recenterMap) {
                        let coords = localStorage.getItem('coords');
                        if (coords !== undefined && coords !== undefined) {
                            coords = localStorage.getItem('coords').split('_');
                            if (coords.length > 1)
                                mapConfig.recenterMap(coords[0], coords[1]);
                        }
                    }
                    if (response.Object !== undefined && response.Object !== null)
                        mapConfig.setMarkersPoint(response.Object);

                    if (response.Status === 205) {
                        $('.load_more_bt').hide();
                        toastr.error(response.Message);
                    }
                    else {
                        $('.load_more_bt').show();
                    }
                }
            }
            else {
                toastr.error(response.Message);
            }
            //alert("success");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            //alert("error");
            toastr.error(errorThrown);
        }).always(function () {
            //alert("complete");
        });
    },
    getFilterTypes: function () {
        $.ajax({
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
            toastr.error(errorThrown);
        }).always(function () {
            //alert("complete");
        });
    },
    loadMoreItems: function () {
        if (listConfig.xhrItems !== undefined && listConfig.xhrItems !== null)
        listConfig.xhrItems.abort();
        listConfig.getListItems();
    },
    setDistanceFromTo: function (from, to) {
        listConfig.searchFilters.DistanceFrom = from;
        listConfig.searchFilters.DistanceTo = to;
    },
    loadLocationDependentData: function (position) {
        locationConfig.geoLocationSuccess(position);
        listConfig.resetSearchFilters();
        
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
            max: 150,
            from: 0,
            to: 120,
            type: 'double',
            step: 1,
            prefix: "Km ",
            grid: true,
            onStart: function (data) {
                // Called right after range slider instance initialised
                listConfig.setDistanceFromTo(data.from, data.to);
            },
            onChange: function (data) {
                // Called every time handle position is changed
                listConfig.setDistanceFromTo(data.from, data.to);
            },
            onFinish: function (data) {
                // Called then action is done and mouse is released
                listConfig.setDistanceFromTo(data.from, data.to);
            },
            onUpdate: function (data) {
                // Called then slider is changed using Update public method
                listConfig.setDistanceFromTo(data.from, data.to);
            }
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
    $(window).load(function () {
        $('#list-load-more').hide();
        listConfig.getListItems(true);

    });
});

$('#performSearch').on('click', () => {
    $('.load_more_bt').show();
    listConfig.setSearchFilters(true);
    $('#tools').nextAll('div').remove();
    mapConfig.removeAllMarkers();
    listConfig.getListItems();
    $(".search-overlay-close").trigger('click');
});

function showMenuFunc(){
    showProgress();
}