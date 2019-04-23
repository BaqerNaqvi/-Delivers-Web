let deliveryConfig = {
    emptyGuid: "00000000-0000-0000-0000-000000000000",
    errorMessage: "Something went wrong",
    successMessage: "Operation Successful",
    totalItems: 10,
    jqXHR: null,
    searchFilters: {
        TypeList: [],
        Cords: null,
        CurrentPage: 1,
        ItemsPerPage: 6,
        SearchTerm: "",
        DistanceFrom: "0",
        DistanceTo: "100",
        Rating: "0",
        IsWeb: true,
        SortOrder: null,
        OrderBy: null
    },
    resetSearchFilters: function () {
        deliveryConfig.searchFilters = {
            TypeList: [],
            Cords: locationConfig.getCoords(),
            CurrentPage: 1,
            ItemsPerPage: 6,
            SearchTerm: "",
            DistanceFrom: "0",
            DistanceTo: "100",
            Rating: "0",
            IsWeb: true,
            SortOrder: null,
            OrderBy: null
        };
    },
    getListItems: function () {
        this.jqXHR = $.ajax({
            method: "POST",
            url: "/Delivery/FetchItemsPartialAsync",
            dataType: "html",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ itemSearchModel: deliveryConfig.searchFilters })
        }).done(function (response) {
            $('.load-popular-items').html(response);
            //alert("success");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            //alert("error");
            toastr.error(errorThrown);
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
    //if (locationConfig.coords === null) {
    //    if (locationConfig.checkGeoLocationSupported() && locationConfig.errorCode === null) {
    //        locationConfig.getGeoLocation(deliveryConfig.loadLocationDependentData);
    //    }
    //}
    deliveryConfig.resetSearchFilters();
    deliveryConfig.getListItems();
});

window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 40 || document.documentElement.scrollTop >=40) {
        document.getElementById("logoImage").style.height = "50px";
        document.getElementById("logoImage").style.width = "50px";
    } else {
        document.getElementById("logoImage").style.height = "100px";
        document.getElementById("logoImage").style.width = "100px";
    }
}