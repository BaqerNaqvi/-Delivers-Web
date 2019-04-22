

const cartSnapShotJSObj = {
    paintItemsFromLocalStorageToCartSnapShot: () => {
        try {
            const retrievedList = JSON.parse(localStorage.getItem("itemsInCart"));
            let HTML = ``;
            let subTotal = 0;
            let price = 0;
            //get these delivery charges from server
            let deliveryCharges = 50;


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
                                <strong class="pull-right">Rs 50</strong>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Delivery schedule <a href="#" class="tooltip-1" data-placement="top" title="" data-original-title="Please consider 30 minutes of margin for the delivery!"><i class="icon_question_alt"></i></a>
                            </td>
                            <td>
                                <strong class="pull-right">Today 07.30 pm</strong>  
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

        const orderDetails = JSON.parse(localStorage.getItem("orderDetailsObj"));
        const itemsIncart = JSON.parse(localStorage.getItem("itemsInCart"));
        let Items = [];

        itemsIncart.forEach((pObj, index) => {

            pObj.items.forEach((cObj, index) => {
                const item = {
                    "ItemId": cObj.Id,
                    "Quantity": cObj.Count,
                    "StoreId": pObj.resId
                }
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
            if (obj.Success === "true") {

                //paint these values where ever required
                //console.log(obj);
                alert("your order has been placed!");
                console.log("your info has been updated");

                //redirect here to last page of Cart
            } else {
                console.log("something went wrong, couldn't update user info");
            }
        }
        ).fail(function (err) {
            console.log(err);
        });
    }
}


$(document).ready(() => {

    orderSummaryJSObj.paintItemsFromLocalStorageToCart();
    cartSnapShotJSObj.paintItemsFromLocalStorageToCartSnapShot();
});