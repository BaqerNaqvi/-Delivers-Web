let deliveryConfig = {
    emptyGuid: "00000000-0000-0000-0000-000000000000",
    errorMessage: "Something went wrong",
    successMessage: "Operation Successful",
    totalItems: 10,
    jqXHR: null,
    searchFilters: {
        TypeList: [],
        Cords: "32.22982263_74.18175494",
        CurrentPage: 1,
        ItemsPerPage: 6,
        SearchTerm: "",
        DistanceFrom: "0",
        DistanceTo: "15",
        Rating: "0",
        IsWeb: true,
        SortOrder: null,
        OrderBy: null
    },
    resetSearchFilters: function () {
        deliveryConfig.searchFilters = {
            TypeList: [],
            Cords: (locationConfig.coords !== null ? locationConfig.coords : "32.22982263_74.18175494"),
            CurrentPage: 1,
            ItemsPerPage: 6,
            SearchTerm: "",
            DistanceFrom: 0,
            DistanceTo: 5,
            Rating: "0",
            IsWeb: true,
            SortOrder: null,
            OrderBy: null
        };
    },
    getListItems: function () {
        this.jqXHR = $.ajax({
            method: "POST",
            url: "FetchItemsPartialAsync",
            dataType: "html",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ itemSearchModel: deliveryConfig.searchFilters })
        }).done(function (response) {
            $('.load-popular-items').html(response);
            //alert("success");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            //alert("error");
        }).always(function () {
            //alert("complete");
        });
    },
    loadLocationDependentData: function (position) {
        locationConfig.geoLocationSuccess(position);
        deliveryConfig.resetSearchFilters();
        deliveryConfig.getListItems();
    }
};


$(() => {
    $(document).ready(function () {
        'use strict';
        HeaderVideo.init({
            container: $('.header-video'),
            header: $('.header-video--media'),
            videoTrigger: $("#video-trigger"),
            autoPlayVideo: true
        });

    });
    if (locationConfig.coords === null) {
        if (locationConfig.checkGeoLocationSupported() && locationConfig.errorCode === null) {
            locationConfig.getGeoLocation(deliveryConfig.loadLocationDependentData);
        }
    }
    //deliveryConfig.resetSearchFilters();
    //deliveryConfig.getListItems();
});