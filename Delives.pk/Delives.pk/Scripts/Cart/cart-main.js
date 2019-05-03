
const cartJSObj = {

    updateUserInfo: () => {
        const objToSend = {
            UserId: "33669f22-43da-4f5d-b801-91ade07afc5d",
            FirstName: $("#user-first-name").val(),
            LastName: $("#user-last-name").val(),
            Address: $("#user-address").val(),
            Cords: null
        };
        showProgress();
        var jqxhr = $.post("UpdateUserInfo", objToSend, function (obj) {
            hideProgress()
            if (obj.Success === "true") {
                toastr.success("your info has been updated");
                //paint these values where ever required
                //console.log(obj);
                console.log("your info has been updated");
            } else {
                toastr.error("something went wrong, couldn't update user info");
                console.log("something went wrong, couldn't update user info");
            }
        }
        ).fail(function (err) {
            hideProgress()
            console.log(err);
        });


    },
    addAllOrderDetailsToLocalStorage: () => {

        if (coordsForDelivery === undefined || coordsForDelivery === null || coordsForDelivery === "") {
            toastr.error("Please provide a valid delivery address to place your order.");
            return;
        }

        const itemsIncart = JSON.parse(localStorage.getItem("itemsInCart"));

        if (itemsIncart === null || itemsIncart.length === 0) {
            toastr.error("Please add one or more items to continue!");
            return;
        }

        const orderDetailsObj = {
            "Address": $("#address_delivery").val(),
            "Instructions": $("#notes").val(),
            "PaymentMethod": "Free",
            "Cords": coordsForDelivery
        };

        //set the new updated list again in local storage 
        localStorage.setItem('orderDetailsObj', JSON.stringify(orderDetailsObj));

        window.location.href = `${window.location.origin}/cart/Snapshot`;
        showProgress();
    },
    openMapPopup: () => {

    }
};


//Modal js

// Get the modal
var modal = document.getElementById('mapModal');

// Get the button that opens the modal
var btn = document.getElementById("address_delivery");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close-modal")[0];

// When the user clicks on the button, open the modal 
btn.onclick = function () {

    // The following example creates a marker in Stockholm, Sweden using a DROP
    // animation. Clicking on the marker will toggle the animation between a BOUNCE
    // animation and no animation.

    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

//Modal js ends here

var markerForDeliveryAddress;
var coordsForDelivery = null;
function initMapForDeliveryAddress() {
    var co = localStorage.getItem("coords");
    if (co == undefined || co == "") {
        co = "32.22674287_74.17007446";
    }
    const cooridnates = co.split('_');
    const cood_1 = parseFloat(cooridnates[0]);
    const cood_2 = parseFloat(cooridnates[1]);
    //to pre-populate address field inside map

    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({ 'location': { lat: cood_1, lng: cood_2 } }, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
                $("#delivery-address-input").val(results[0].formatted_address);
                $("#address_delivery").val(results[0].formatted_address);
                //
            } else {
                console.log('No results found, cannot prepopulate address field');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    }, (err) => {
        console.log(err);
    });


    var map = new google.maps.Map(document.getElementById('map-for-delivery-address'), {
        zoom: 17,
        center: { lat: cood_1, lng: cood_2 }
    });

    markerForDeliveryAddress = new google.maps.Marker({
        map: map,
        draggable: true,
        //animation: google.maps.Animation.DROP,
        position: { lat: cood_1, lng: cood_2 }
    });

    var input = document.getElementById('delivery-address-input');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setFields(
        ['address_components', 'geometry', 'icon', 'name']);
    //
    var infowindow = new google.maps.InfoWindow();
    //var infowindowContent = document.getElementById('infowindow-content-delivery-address');
    var infowindowContent = document.getElementById('infowindow-content-delivery-address');
    //
    infowindow.setContent(infowindowContent);

    autocomplete.addListener('place_changed', function () {

        try {
            infowindow.close();

            var place = autocomplete.getPlace();
            if (!place.geometry) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                toastr.error("No details available for input: '" + place.name + "'");
                return;
            }

            // If the place has a geometry, then present it on a map.
            var address = '';
            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }


            //$("#delivery-address-input").val(results[0].formatted_address);
            $("#address_delivery").val(address);

            var latLngObj = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
            markerForDeliveryAddress.setPosition(latLngObj);

            map.setZoom(17);      // This will trigger a zoom_changed on the map
            map.setCenter(latLngObj);


        } catch (e) {
            console.log(e);
        }

        
        
    });

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    function setupClickListener(id, types) {
        var radioButton = document.getElementById(id);
        if (radioButton != null) {
            radioButton.addEventListener('click', function () {
                autocomplete.setTypes(types);
            });
        }

    }

    setupClickListener('changetype-all', []);
    setupClickListener('changetype-address', ['address']);
    setupClickListener('changetype-establishment', ['establishment']);
    setupClickListener('changetype-geocode', ['geocode']);

    // markerForDeliveryAddress.addListener('click', toggleBounce);
    markerForDeliveryAddress.addListener('dragend', (event) => {
        console.log("dragend");
        coordsForDelivery = event.latLng.lat() + "_" + event.latLng.lng();

        var geocoder = new google.maps.Geocoder;
        geocoder.geocode({ 'location': event.latLng }, function (results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    $("#delivery-address-input").val(results[0].formatted_address);
                    $("#address_delivery").val(results[0].formatted_address);
                } else {
                    //window.alert('No results found');
                }
            } else {
                //window.alert('Geocoder failed due to: ' + status);
            }
        });
    });
}

//function toggleBounce() {
//    if (markerForDeliveryAddress.getAnimation() !== null) {
//        markerForDeliveryAddress.setAnimation(null);
//    } else {
//        markerForDeliveryAddress.setAnimation(google.maps.Animation.BOUNCE);
//    }

//    google.maps.event.addListener(markerForDeliveryAddress, "dragend", function (event) {
//        var lat = event.latLng.lat();
//        var lng = event.latLng.lng();
//        console.log(lat + "-" + lng);
//    });

//}

$(document).ready(() => {

    orderSummaryJSObj.paintItemsFromLocalStorageToCart();
    coordsForDelivery = localStorage.getItem("coords") !== null && localStorage.getItem("coords") !== undefined ? localStorage.getItem("coords") : null;
    
});