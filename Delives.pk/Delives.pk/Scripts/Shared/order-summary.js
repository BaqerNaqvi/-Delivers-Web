const orderSummaryJSObj = {

    addToLocalStorage: (item) => {

        //try {


        //old working code start
        //    let objToStore = {
        //        itemDetails: item,
        //        count: 0
        //    };

        //    //get the complete list from local storage, and empty the local storage.
        //    let lsList = JSON.parse(localStorage.getItem("itemsInCart"));
        //    let retrievedList = lsList === null ? [] : lsList;

        //    localStorage.removeItem("itemsInCart");

        //    const menuItem = retrievedList.find((obj) => { return obj.Id === item.Id; });
        //    //see if item with id already exists, just increment the count
        //    //if not, add item to list with count 1
        //    if (menuItem === null || menuItem === undefined) {

        //        var newItemWithResInfo = {
        //            resName: "",
        //            resId: "",
        //            item: item
        //        };

        //        newItemWithResInfo.item.Count = 1;
        //        retrievedList.push(newItemWithResInfo);

        //        //var newItem = item;
        //        //newItem.Count = 1;
        //        //newItem.ResName = currentResName;
        //        //newItem.ResId = currentResId;
        //        //retrievedList.push(newItem);
        //    } else {
        //        retrievedList.map((obj) => {
        //            if (obj.item.Id === item.Id) {
        //                obj.Count = obj.Count + 1;
        //            }
        //            return obj;
        //        });
        //    }

        //    //set the new updated list again in local storage 
        //    localStorage.setItem('itemsInCart', JSON.stringify(retrievedList));

        //    //paint the front end with this new local storage array.
        //    orderSummaryJSObj.paintItemsFromLocalStorageToCart();

        //} catch (e) {
        //    console.log(e);
        //}

        //old working code - end 

        //temp new code
        try {


            //get the complete list from local storage, and empty the local storage.
            let lsList = JSON.parse(localStorage.getItem("itemsInCart"));
            let retrievedList = lsList === null ? [] : lsList;
            //let prevObj = retrievedList;
            //find restuarant info and list items obj  in local storage
            const resInfoAndListItemsObj = retrievedList.find((obj) => { return obj.resId === currentResId; });

            //If restuarant not found in local storage
            if (resInfoAndListItemsObj === null || resInfoAndListItemsObj === undefined) {
                var _resInfoAndListItemsObj = {
                    resName: currentResName,
                    resId: currentResId,
                    items: []
                };

                var _item = item;
                _item.Count = 1;
                _resInfoAndListItemsObj.items.push(_item);

                //add updated obj to local storage
                retrievedList.push(_resInfoAndListItemsObj);
                localStorage.setItem('itemsInCart', JSON.stringify(retrievedList));

            } else {

                var itemInSpecificResObj = resInfoAndListItemsObj.items.find((obj) => {
                    return obj.Id === item.Id;
                });
                if (itemInSpecificResObj === null || itemInSpecificResObj === undefined) {
                    item.Count = 1;
                    //resInfoAndListItemsObj.items.push(item);
                    let tempList = retrievedList.map((obj) => {
                        if (obj.resId === currentResId) {
                            obj.items.push(item);
                        }
                        return obj;
                    });
                    localStorage.setItem('itemsInCart', JSON.stringify(tempList));
                } else {
                    let tempList = retrievedList.map((obj) => {
                        if (obj.resId === currentResId) {
                            obj.items = obj.items.map((x) => {
                                if (x.Id === item.Id) {
                                    x.Count = x.Count + 1;
                                }
                                return x;
                            });
                        }
                        return obj;
                    });
                    localStorage.setItem('itemsInCart', JSON.stringify(tempList));
                }
            }

            orderSummaryJSObj.paintItemsFromLocalStorageToCart();
        } catch (e) {
            console.log(e);
        }
        //temp new code end



    },
    removeFromLocalStorage: (id) => {

        try {

            ////get the complete list from local storage, and empty the local storage.
            //let lsList = JSON.parse(localStorage.getItem("itemsInCart"));
            //let retrievedList = lsList === null ? [] : lsList;

            ////decrement the count for this item
            //retrievedList.map((obj) => {
            //    if (obj.Id === id && obj.Count > 0) {
            //        obj.Count = obj.Count - 1;
            //    }
            //    return obj;
            //});

            ////set the new updated list again in local storage 
            //localStorage.setItem('itemsInCart', JSON.stringify(retrievedList));

            ////paint the front end with this new local storage array.
            //orderSummaryJSObj.paintItemsFromLocalStorageToCart();

            //new code start


            let lsList = JSON.parse(localStorage.getItem("itemsInCart"));
            let retrievedList = lsList === null ? [] : lsList;

            //const tempList = retrievedList.forEach((parentObj, index) => {

            //    parentObj.items.forEach((childObj, index2) => {
            //        if (childObj.Id === id) {
            //            childObj.Count = childObj.Count - 1;
            //        }
            //    });
            //});

            const tempList = retrievedList.map((pObj) => {
                const mappedList = pObj.items.map((cObj) => {
                    if (cObj.Id === id) {
                        if (cObj.Count > 0) {
                            cObj.Count = cObj.Count - 1;

                        }
                    }
                    return cObj;
                });

                const tempListFiltered = mappedList.filter((x) => { return x.Count > 0; });
                pObj.items = tempListFiltered;

                return pObj;

            });


            const tempParentListFiltered = tempList.filter((x) => {
                return x.items !== undefined && x.items !== null && x.items.length > 0;
            });

            //retrievedList.map((parentObj) => {

            //})


            localStorage.setItem('itemsInCart', JSON.stringify(tempParentListFiltered));
            //paint the front end with this new local storage array.
            orderSummaryJSObj.paintItemsFromLocalStorageToCart();
            //new code end


        } catch (e) {
            console.log(e);
        }


    },
    //    paintItemsFromLocalStorageToCart: () => {

    //        try {
    //            const retrievedList = JSON.parse(localStorage.getItem("itemsInCart"));
    //            let itemsHTML = "";
    //            let subTotal = 0;
    //            let price = 0;

    //            //get these delivery charges from server
    //            let deliveryCharges = 50;
    //            if (retrievedList !== undefined && retrievedList !== null) {
    //                for (var i = 0; i < retrievedList.length; i++) {
    //                    if (retrievedList[i].Count > 0) {
    //                        price = retrievedList[i].Count * retrievedList[i].Price;
    //                        itemsHTML += `<tr>
    //                                <td>
    //                                    <a href="javascript:void(0)" onclick="orderSummaryJSObj.removeFromLocalStorage(${retrievedList[i].Id})" class="remove_item"><i class="icon_minus_alt"></i></a> <strong>${retrievedList[i].Count}x</strong> ${retrievedList[i].Name}
    //                                </td>
    //                                <td>
    //                                    <strong class="pull-right">Rs ${price}</strong >
    //                                </td>
    //                            </tr>`;
    //                        subTotal += price;
    //                    }

    //                }
    //            }

    //            let markUp = ` <h3>Your order <i class="icon_cart_alt pull-right"></i></h3>
    //<h4>Chatkhara Restuarant</h4>
    //                    <table class="table table_summary" id="table-cart-orders">
    //                        <tbody>
    //                            ${itemsHTML}
    //                        </tbody>
    //                    </table>
    //                    <hr>
    //                    <div class="row" id="options_2">
    //                        <div class="col-lg-6 col-md-12 col-sm-12 col-xs-6">
    //                            <label><input type="radio" value="" checked name="option_2" class="icheck">Delivery</label>
    //                        </div>
    //                        <div class="col-lg-6 col-md-12 col-sm-12 col-xs-6">
    //                            <label><input type="radio" value="" name="option_2" class="icheck">Take Away</label>
    //                        </div>
    //                    </div><!-- Edn options 2 -->

    //                    <hr>
    //                    <table class="table table_summary">
    //                        <tbody>
    //                            <tr>
    //                                <td>
    //                                    Subtotal <span class="pull-right">Rs ${subTotal}</span>
    //                                </td>
    //                            </tr>
    //                            <tr>
    //                                <td>
    //                                    Delivery fee <span class="pull-right">Rs ${deliveryCharges}</span>
    //                                </td>
    //                            </tr>
    //                            <tr>
    //                                <td class="total">
    //                                    TOTAL <span class="pull-right">Rs ${deliveryCharges + subTotal}</span>
    //                                </td>
    //                            </tr>
    //                        </tbody>
    //                    </table>
    //                    <hr>`;

    //            //for (var i = 0; i < retrievedList.length; i++) {
    //            //    markUp += ``;
    //            //}

    //            $("#cart_box_section-1").html(markUp);
    //        } catch (e) {
    //            console.log(e);
    //        }

    //    }

    paintItemsFromLocalStorageToCart: () => {

        try {

            const retrievedList = JSON.parse(localStorage.getItem("itemsInCart"));
            let HTML = `<h3>Your order <i class="icon_cart_alt pull-right"></i></h3>`;
            let subTotal = 0;
            let price = 0;
            //get these delivery charges from server
            let deliveryCharges = 50;

            retrievedList.forEach((parentObj, index) => {

                let itemsHTML = "";
                parentObj.items.forEach((childObj, index2) => {

                    price = childObj.Count * childObj.Price;
                    subTotal += price;
                    itemsHTML += `<tr>
                                <td>
                                    <a href="javascript:void(0)" onclick="orderSummaryJSObj.removeFromLocalStorage(${childObj.Id})" class="remove_item"><i class="icon_minus_alt"></i></a> <strong>${childObj.Count}x</strong> ${childObj.Name}
                                </td>
                                <td>
                                    <strong class="pull-right">Rs ${price}</strong >
                                </td>
                            </tr>`;
                });

                HTML += `<h4>${parentObj.resName}</h4>
                    <table class="table table_summary" id="table-cart-orders">
                        <tbody>
                            ${itemsHTML}
                        </tbody>
                    </table>
                    `;
            });

            HTML += `<div class="row" id="options_2">
                        <div class="col-lg-6 col-md-12 col-sm-12 col-xs-6">
                            <label><input type="radio" value="" checked name="option_2" class="icheck">Delivery</label>
                        </div>
                        //<div class="col-lg-6 col-md-12 col-sm-12 col-xs-6">
                        //    <label><input type="radio" value="" name="option_2" class="icheck">Take Away</label>
                        //</div>
                    </div><!-- Edn options 2 -->

                    <hr>
                    <table class="table table_summary">
                        <tbody>
                            <tr>
                                <td>
                                    Subtotal <span class="pull-right">Rs ${subTotal}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Delivery fee <span class="pull-right">Rs ${deliveryCharges}</span>
                                </td>
                            </tr>
                            <tr>
                                <td class="total">
                                    TOTAL <span class="pull-right">Rs ${deliveryCharges + subTotal}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <hr>`;
            $("#cart_box_section-1").html(HTML);

        } catch (e) {
            console.log(e);
        }

    }
}

const groupBy = (items, key) => items.reduce(
    (result, item) => ({
        ...result,
        [item[key]]: [
            ...(result[item[key]] || []),
            item,
        ],
    }),
    {},
);


//window.addEventListener('storage', function (event) {
//    if (event.storageArea === localStorage) {
//        orderSummaryJSObj.paintItemsFromLocalStorageToCart();
//    }
//}, false);

function orderNowfunc(){
    showProgress();
}