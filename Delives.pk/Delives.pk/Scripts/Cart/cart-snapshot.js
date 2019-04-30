
var deliveryChargesObjGlobal = null;
const cartSnapShotJSObj = {
    paintItemsFromLocalStorageToCartSnapShot: () => {
        try {
            const retrievedList = JSON.parse(localStorage.getItem("itemsInCart"));
            let HTML = ``;
            
            let price = 0;
            //get these delivery charges from server
            let deliveryCharges = deliveryChargesObjGlobal.DeliveryAmount;
            let subTotal = deliveryCharges;

            retrievedList.forEach((parentObj, index) => {

                let itemsHTML = `<h4>${parentObj.resName}</h4>`;
                parentObj.items.forEach((childObj, index2) => {

                    price = childObj.Count * childObj.Price;
                    subTotal += price;
                    itemsHTML += `<tr>
                            <td>
                                <strong>${childObj.Count}</strong> ${childObj.Name}
                            </td>
                            <td>
                                <strong class="pull-right">Rs ${price}</strong>
                            </td>
                        </tr>`;

                    
                });

                HTML += `
                <table class="table table-striped nomargin">
                    <tbody>
                        ${itemsHTML}`;
            });

            HTML += `
<tr>
                            <td>
                                Delivery charges
                            </td>
                            <td>
                                <strong class="pull-right">Rs ${deliveryCharges}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Delivery schedule <a href="#" class="tooltip-1" data-placement="top" title="" data-original-title="Please consider 30 minutes of margin for the delivery!"><i class="icon_question_alt"></i></a>
                            </td>
                            <td>
                                <strong class="pull-right">${deliveryChargesObjGlobal.DeliveryTime} minutes</strong>
                            </td>
                        </tr>
                        <tr>
                            <td class="total_confirm">
                                TOTAL
                            </td>
                            <td class="total_confirm">
                                <span class="pull-right">Rs ${subTotal}</span>
                            </td>
                        </tr>
                        </tbody>
                    </table>`;
            $("#summary-cart-snapshot-div").html(HTML);

        } catch (e) {
            console.log(e);
        }
    },
    placeOrder: () => {
        showProgress();
        const orderDetails = JSON.parse(localStorage.getItem("orderDetailsObj"));
        const itemsIncart = JSON.parse(localStorage.getItem("itemsInCart"));

        if (itemsIncart === null || itemsIncart.length === 0) {
            toastr.error("Please add one or more items to continue!");
            return;
        }

        let Items = [];

        itemsIncart.forEach((pObj, index) => {

            pObj.items.forEach((cObj, index) => {
                const item = {
                    "ItemId": cObj.Id,
                    "Quantity": cObj.Count,
                    "StoreId": pObj.resId
                };
                Items.push(item);
            });


            
        });

        const objToServer = {
            Address: orderDetails.Address,
            Instructions: orderDetails.Instructions,
            PaymentMethod: orderDetails.PaymentMethod,
            Cords: orderDetails.Cords,
            Items: Items
        };

        var jqxhr = $.post("PlaceOrder", objToServer, function (obj) {

            hideProgress();
            if (obj.Success === "true") {

                //paint these values where ever required
                //console.log(obj);
                //alert("your order has been placed!");
                const orderIds = obj.OrderId;
                //post to the final cart page- (order confirmed)
                //var newForm = jQuery('<form>', {
                //    'action': `${window.location.origin}/Cart/OrderConfirmed`,
                //    'target': '_blank'
                //}).append(jQuery('<input>', {
                //    'name': 'OrderIds',
                //    'value': orderIds,
                //    'type': 'hidden'
                //}));
                //newForm.submit();
                window.location.href = `${window.location.origin}/Cart/OrderConfirmed`;
                //var f = document.createElement("form");
                //f.setAttribute('method', "post");
                //f.setAttribute('action', "/Cart/OrderConfirmed");

                //var i = document.createElement("input"); //input element, text
                //i.setAttribute('type', "text");
                //i.setAttribute('name', "username");

                //var s = document.createElement("input"); //input element, Submit button
                //s.setAttribute('type', "submit");
                //s.setAttribute('value', "Submit");

                //f.appendChild(i);
                //f.appendChild(s);

                //and some more input elements here
                //and dont forget to add a submit button

                document.getElementsByTagName('body')[0].appendChild(f);


                //console.log("your info has been updated");

                //redirect here to last page of Cart
            } else {
                console.log("something went wrong, couldn't update user info");
            }
        }
        ).fail(function (err) {
            hideProgress();
            console.log(err);
        });
    },
    fetchDeliveryChargesAndTime: () => {

        const orderDetails = JSON.parse(localStorage.getItem("orderDetailsObj"));
        const itemsIncart = JSON.parse(localStorage.getItem("itemsInCart"));

        if (itemsIncart === null || itemsIncart.length === 0) {
            toastr.error("Please add one or more items to continue!");
            return;
        }

        let Items = [];

        itemsIncart.forEach((pObj, index) => {

            pObj.items.forEach((cObj, index) => {
                const item = {
                    "ItemId": cObj.Id,
                    "Quantity": cObj.Count,
                    "StoreId": pObj.resId
                };
                Items.push(item);
            });



        });

        const objToServer = {
            Address: orderDetails.Address,
            Instructions: orderDetails.Instructions,
            PaymentMethod: orderDetails.PaymentMethod,
            Cords: orderDetails.Cords,
            Items: Items
        };

        var jqxhr = $.post("FetchDeliveryChargesAndTime", objToServer, function (obj) {
            if (obj.Success === "true") {
                deliveryChargesObjGlobal = obj.Data;
                orderSummaryJSObj.paintItemsFromLocalStorageToCart('fromSnapshot',obj.Data);
                cartSnapShotJSObj.paintItemsFromLocalStorageToCartSnapShot();
            } else {
                console.log("something went wrong, couldn't fetch delivery charges");
            }
        }
        ).fail(function (err) {
            console.log(err);
        });
    }
}


$(document).ready(() => {

    cartSnapShotJSObj.fetchDeliveryChargesAndTime();
    
});