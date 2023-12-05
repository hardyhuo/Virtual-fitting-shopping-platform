
const selectedBackgroundClass = "btn btn-success";
const unselectedBackgroundClass = "btn btn-secondary";

$(document).ready(function () {
    // Mia - get user shoppingcart

    let userId = $.cookie("userId");

    if (userId === undefined) {
        window.location.href = '/';
    }

    //calculate the total sum of the prices
    function getSum() {
        let money = 0;
        $('.itemSum').each(function (i, ele) {
            let a = parseFloat($(ele).text())
            money += a;
        });

        $('.priceSum em').text("$" + money.toFixed(2));
    }

    getSum();

    // 2. edit quantity
    $('.minusAmount').each(function (i, ele) {
        $(ele).click(function () {
            let clickItemIpt = $(ele).siblings("input[name='itemIpt']")
            let currentQty = parseFloat(clickItemIpt.val())
            currentQty -= 1

            if (currentQty >= 0) {
                clickItemIpt.val(currentQty)

                let subtotal = 0;
                let currentItemPriceEle = $(ele).parent().parent().siblings('.itemPrice')
                let currentItemPrice = parseFloat(currentItemPriceEle.text())
                subtotal = currentItemPrice * currentQty
                let subtotalEle = $(ele).parent().parent().siblings('.itemSum')
                subtotalEle.text(subtotal)

                getSum();
            }

            else {
                clickItemIpt.val(0)
                getSum();

            }
        })
    })

    $('.addAmount').each(function (i, ele) {
        $(ele).click(function () {
            let clickItemIpt = $(ele).siblings("input[name='itemIpt']")
            let currentQty = parseFloat(clickItemIpt.val())
            currentQty += 1

            if (currentQty >= 0) {
                clickItemIpt.val(currentQty)

                let subtotal = 0;
                let currentItemPriceEle = $(ele).parent().parent().siblings('.itemPrice')
                let currentItemPrice = parseFloat(currentItemPriceEle.text())
                subtotal = currentItemPrice * currentQty
                let subtotalEle = $(ele).parent().parent().siblings('.itemSum')
                subtotalEle.text(subtotal)

                getSum();
            }

            else {
                clickItemIpt.val(0)
                getSum();

            }
        })

    })


    //update item quantity
    $('body').on('click', '.updateQuantityConfirm', function () {

        let itemId = $(this).val();

        let clickItemIpt = $(this).siblings("input[name='itemIpt']")
        let quantity = parseFloat(clickItemIpt.val())

        //call update
        userId = $.cookie("userId");

        if (userId !== undefined) {
            if (confirm("Are you sure you want to update quantity?")) {
                // confirm update

                let data = { itemId: itemId, userId: userId, quantity: quantity };

                $.post('/user/updateShoppingCartItemQuantity', data, function (result) {
                    alert(result.message);
                    if (result.valid) {
                        window.location.href = '/user/shoppingCartPage/' + userId;
                    }
                });
            }
        }
        else {
            alert("Login status expired, please login again");
            window.location.href = '/';
        }

    });

    //delete
    $('body').on('click', '.itemDelete', function () {

        let itemId = $(this).val();

        //call delete

        userId = $.cookie("userId");

        if (userId !== undefined) {
            if (confirm("Are you sure you want to delete this item?")) {
                // confirm delte
                let data = { itemId: itemId, userId: userId };

                $.post('/user/delteItemFromCart', data, function (result) {
                    alert(result.message);
                    if (result.valid) {
                        window.location.href = '/user/shoppingCartPage/' + userId;
                    }
                });
            }
        } else {
            alert("Login status expired, please login again");
            window.location.href = '/';
        }

    });


    // 4. checkout
    $('body').on('click', '.checkOutButton', function () {

        userId = $.cookie("userId");

        if (userId !== undefined) {
            let subTotal = 0;
            $('.itemSum').each(function (i, ele) {
                let a = parseFloat($(ele).text())
                subTotal += a;
            });

            if (subTotal == 0) {
                alert("Your shopping cart is empty");
            }
            else {
                let paymentMethod = $('#purchaseMethodSelection').val();

                if (paymentMethod === "") {
                    alert("Please select payment method");
                }
                else {
                    if (confirm("Are you sure you want to checkout?")) {
                        // confirm checkout

                        let elements = $('.quantityForm');

                        let itemData = [];

                        for (let element of elements) {
                            let tmp = {};
                            for (let child of element.childNodes) {
                                let className = child.className;
                                if (className === 'itemIpt') {
                                    tmp.quantity = parseInt(child.value);
                                }
                                if (className === 'btn btn-secondary updateQuantityConfirm') {
                                    tmp.itemId = child.value;
                                }
                            }
                            itemData.push(tmp);
                        }

                        let data = { userId: userId, paymentMethod: paymentMethod, itemData: JSON.stringify(itemData) };

                        $.post('/user/shoppingCartCheckOut', data, function (result) {
                            alert(result.message);
                            if (result.valid) {
                                window.location.href = '/user/shoppingCartPage/' + userId;
                            }
                        });
                    }
                }
            }
        } else {
            alert("Login status expired, please login again");
            window.location.href = '/';
        }

    });
})