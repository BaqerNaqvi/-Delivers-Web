
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
            "Address": $("#user-address").val(),
            "Instructions": $("#notes").val(),
            "PaymentMethod": "Free",
            "Cords": "32.202895_74.176716"
        };

        //set the new updated list again in local storage 
        localStorage.setItem('orderDetailsObj', JSON.stringify(orderDetailsObj));
    }
};


$(document).ready(() => {

    orderSummaryJSObj.paintItemsFromLocalStorageToCart();

});