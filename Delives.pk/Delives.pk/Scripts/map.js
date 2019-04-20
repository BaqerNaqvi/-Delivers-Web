var mapConfig = {
    mapObject: null,
    mapOptions: {
        zoom: 14,
        center: new google.maps.LatLng(32.1611321, 74.1765673),
        mapTypeId: google.maps.MapTypeId.ROADMAP,

        mapTypeControl: false,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        panControl: false,
        panControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.TOP_LEFT
        },
        scrollwheel: false,
        scaleControl: false,
        scaleControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT
        },
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        },
        styles:
            [{ "featureType": "landscape", "stylers": [{ "hue": "#FFBB00" }, { "saturation": 43.400000000000006 }, { "lightness": 37.599999999999994 }, { "gamma": 1 }] }, { "featureType": "road.highway", "stylers": [{ "hue": "#FFC200" }, { "saturation": -61.8 }, { "lightness": 45.599999999999994 }, { "gamma": 1 }] }, { "featureType": "road.arterial", "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 51.19999999999999 }, { "gamma": 1 }] }, { "featureType": "road.local", "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 52 }, { "gamma": 1 }] }, { "featureType": "water", "stylers": [{ "hue": "#0078FF" }, { "saturation": -13.200000000000003 }, { "lightness": 2.4000000000000057 }, { "gamma": 1 }] }, { "featureType": "poi", "stylers": [{ "hue": "#00FF6A" }, { "saturation": -1.0989010989011234 }, { "lightness": 11.200000000000017 }, { "gamma": 1 }] }]

    },
    marker: null,
    markers: [],
    markersData: null,
    setMap: function () {
        mapConfig.mapObject = new google.maps.Map(document.getElementById('map'), mapConfig.mapOptions);
    },
    setMarkersPoint: function (markersData) {
        markersData.forEach(function (item) {
            console.log(item.Cords);
            var [lat, long] = item.Cords.split('_');
            if (lat !== null && long !== null) {
                mapConfig.marker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat, long),
                    map: mapConfig.mapObject,
                    icon: '../Images/pins/' + item.TypeName + '.png'
                });

                if ('undefined' === typeof mapConfig.markers[item.TypeName])
                    mapConfig.markers[item.TypeName] = [];
                mapConfig.markers[item.TypeName].push(mapConfig.marker);
                google.maps.event.addListener(mapConfig.marker, 'click', function () {
                    mapConfig.closeInfoBox();
                    mapConfig.getInfoBox(item).open(mapConfig.mapObject, this);
                    mapConfig.mapObject.setCenter(new google.maps.LatLng(lat, long));
                });
            }
        });
    },
    getInfoBox: function (item) {
        return new InfoBox({
            content:
                '<div class="marker_info" id="marker_info">' +
                '<img src="' + item.LogoImage + '" alt=""/>' +
                '<h3>' + item.Name + '</h3>' +
                '<em>' + item.TypeName + '</em>' +
                '<span>' + item.Address +
                '<br><strong>Opening time</strong>: ' + item.Opens + '-' + item.Closes + '</span>' +
                '<a href="' + item.BgImage + '" class="btn_1">Details</a>' +
                '</div>',
            disableAutoPan: false,
            maxWidth: 0,
            pixelOffset: new google.maps.Size(10, 110),
            closeBoxMargin: '5px -20px 2px 2px',
            closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
            isHidden: false,
            alignBottom: true,
            pane: 'floatPane',
            enableEventPropagation: true
        });


    },
    closeInfoBox: function () {
        $('div.infoBox').remove();
    },
    hideAllMarkers: function () {
        for (var key in mapConfig.markers)
            mapConfig.markers[key].forEach(function (marker) {
                marker.setMap(null);
            });
    },
    recenterMap: function (lat, long) {
        mapConfig.mapObject.setCenter(new google.maps.LatLng(lat !== null ? lat : 32.1611321, long !== null ? long : 74.1765673));
    }
};
$('#collapseMap').on('shown.bs.collapse', function (e) {
    //(function (A) {

    //    if (!Array.prototype.forEach)
    //        A.forEach = A.forEach || function (action, that) {
    //            for (var i = 0, l = this.length; i < l; i++)
    //                if (i in this)
    //                    action.call(that, this[i], i, this);
    //        };

    //})(Array.prototype);

    //mapConfig.setMap();
});
$(() => {
    mapConfig.setMap();
});