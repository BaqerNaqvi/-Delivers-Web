
const cartJSObj = {

    updateUserInfo: () => {
        const objToSend = {
            UserId: "33669f22-43da-4f5d-b801-91ade07afc5d",
            FirstName: $("#user-first-name").val(),
            LastName: $("#user-last-name").val(),
            Address: $("#user-address").val(),
            Cords: null
        };

        var jqxhr = $.post("UpdateUserInfo", objToSend, function (obj) {
            if (obj.Success === "true") {

                //paint these values where ever required
                //console.log(obj);
                console.log("your info has been updated");
            } else {
                console.log("something went wrong, couldn't update user info");
            }
        }
        ).fail(function (err) {
            console.log(err);
        });


    },
    addAllOrderDetailsToLocalStorage: () => {
        const orderDetailsObj = {
            "Address": $("#address_delivery").val(),
            "Instructions": $("#notes").val(),
            "PaymentMethod": "Free",
            "Cords": coordsForDelivery
        };

        //set the new updated list again in local storage 
        localStorage.setItem('orderDetailsObj', JSON.stringify(orderDetailsObj));
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

    const cooridnates = localStorage.getItem("coords").split('_');
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
    });


    var map = new google.maps.Map(document.getElementById('map-for-delivery-address'), {
        zoom: 13,
        center: { lat: cood_1, lng: cood_2 }
    });

    markerForDeliveryAddress = new google.maps.Marker({
        map: map,
        draggable: true,
        //animation: google.maps.Animation.DROP,
        position: { lat: cood_1, lng: cood_2 }
    });
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

});