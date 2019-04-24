
const menuJSObj = {
    //addToLocalStorage: (item) => {

    //    try {
    //        let objToStore = {
    //            itemDetails: item,
    //            count: 0
    //        };

    //        //get the complete list from local storage, and empty the local storage.
    //        let lsList = JSON.parse(localStorage.getItem("itemsInCart"));
    //        let retrievedList = lsList === null ? [] : lsList;

    //        localStorage.removeItem("itemsInCart");

    //        const menuItem = retrievedList.find((obj) => { return obj.Id === item.Id; });
    //        //see if item with id already exists, just increment the count
    //        //if not, add item to list with count 1
    //        if (menuItem === null || menuItem === undefined) {
    //            var newItem = item;
    //            newItem.Count = 1;
    //            retrievedList.push(newItem);
    //        } else {
    //            retrievedList.map((obj) => {
    //                if (obj.Id === item.Id) {
    //                    obj.Count = obj.Count + 1;
    //                }
    //                return obj;
    //            });
    //        }

    //        //set the new updated list again in local storage 
    //        localStorage.setItem('itemsInCart', JSON.stringify(retrievedList));

    //        //paint the front end with this new local storage array.
    //        menuJSObj.paintItemsFromLocalStorageToCart();

    //    } catch (e) {
    //        console.log(e);
    //    }


    //},
    //removeFromLocalStorage: (id) => {

    //    try {

    //        //get the complete list from local storage, and empty the local storage.
    //        let lsList = JSON.parse(localStorage.getItem("itemsInCart"));
    //        let retrievedList = lsList === null ? [] : lsList;

    //        //decrement the count for this item
    //        retrievedList.map((obj) => {
    //            if (obj.Id === id && obj.Count > 0) {
    //                obj.Count = obj.Count - 1;
    //            }
    //            return obj;
    //        });

    //        //set the new updated list again in local storage 
    //        localStorage.setItem('itemsInCart', JSON.stringify(retrievedList));

    //        //paint the front end with this new local storage array.
    //        menuJSObj.paintItemsFromLocalStorageToCart();
    //    } catch (e) {
    //        console.log(e);
    //    }


    //},
    //paintItemsFromLocalStorageToCart: () => {

    //    try {
    //        const retrievedList = JSON.parse(localStorage.getItem("itemsInCart"));
    //        let itemsHTML = "";
    //        let subTotal = 0;
    //        let price = 0;

    //        //get these delivery charges from server
    //        let deliveryCharges = 50;
    //        if (retrievedList !== undefined && retrievedList !== null) {
    //            for (var i = 0; i < retrievedList.length; i++) {
    //                if (retrievedList[i].Count > 0) {
    //                    price = retrievedList[i].Count * retrievedList[i].Price;
    //                    itemsHTML += `<tr>
    //                            <td>
    //                                <a href="javascript:void(0)" onclick="menuJSObj.removeFromLocalStorage(${retrievedList[i].Id})" class="remove_item"><i class="icon_minus_alt"></i></a> <strong>${retrievedList[i].Count}x</strong> ${retrievedList[i].Name}
    //                            </td>
    //                            <td>
    //                                <strong class="pull-right">Rs ${price}</strong >
    //                            </td>
    //                        </tr>`;
    //                    subTotal += price;
    //                }

    //            }
    //        }

    //        let markUp = ` <h3>Your order <i class="icon_cart_alt pull-right"></i></h3>
    //                <table class="table table_summary" id="table-cart-orders">
    //                    <tbody>
    //                        ${itemsHTML}
    //                    </tbody>
    //                </table>
    //                <hr>
    //                <div class="row" id="options_2">
    //                    <div class="col-lg-6 col-md-12 col-sm-12 col-xs-6">
    //                        <label><input type="radio" value="" checked name="option_2" class="icheck">Delivery</label>
    //                    </div>
    //                    <div class="col-lg-6 col-md-12 col-sm-12 col-xs-6">
    //                        <label><input type="radio" value="" name="option_2" class="icheck">Take Away</label>
    //                    </div>
    //                </div><!-- Edn options 2 -->

    //                <hr>
    //                <table class="table table_summary">
    //                    <tbody>
    //                        <tr>
    //                            <td>
    //                                Subtotal <span class="pull-right">Rs ${subTotal}</span>
    //                            </td>
    //                        </tr>
    //                        <tr>
    //                            <td>
    //                                Delivery fee <span class="pull-right">Rs ${deliveryCharges}</span>
    //                            </td>
    //                        </tr>
    //                        <tr>
    //                            <td class="total">
    //                                TOTAL <span class="pull-right">Rs ${deliveryCharges + subTotal}</span>
    //                            </td>
    //                        </tr>
    //                    </tbody>
    //                </table>
    //                <hr>
    //                <a class="btn_full" href="${window.location.host}/cart/index">Order now</a>`;

    //        //for (var i = 0; i < retrievedList.length; i++) {
    //        //    markUp += ``;
    //        //}

    //        $("#cart_box").html(markUp);
    //    } catch (e) {
    //        console.log(e);
    //    }

    //}
};

$(document).ready(() => {

    orderSummaryJSObj.paintItemsFromLocalStorageToCart();
});