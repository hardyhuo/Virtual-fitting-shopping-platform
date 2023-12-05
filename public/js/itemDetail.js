$(document).ready(function () {

    $("#confirmAddToCartDiv").hide();

    $("#confirmCheckOutDiv").hide();

    $("#downloadHerfHidden").hide();

    $("#uploadPeopleDiv").hide();

    function loginCheck() {
        let userId = $.cookie("userId");

        if (userId === undefined) {
            alert("Please login first");
            return false;
        }

        return true
    }

    $('body').on('click', '#submitCommentButton', function () {

        let commentContent = $("#commentTextArea").val();

        let itemId = $("#submitCommentButton").val();

        let rating = $("#itemRatingSelection").val();

        let reviewer = $.cookie("userId");

        let sellerId = $("#sellerIdInputHidden").val();

        if (!loginCheck()) {
            window.location.replace("/signInUp/loginPage");
            return;
        }

        if (commentContent.length === 0) {
            alert("You cannot post a empty comment");
            return;
        }

        let data = { itemId: itemId, commentContent: commentContent, rating: parseInt(rating), reviewer: reviewer, sellerId: sellerId };

        let route = '/item/postComment';

        $.post(route, data, function (result) {

            if (result.valid) {
                alert(result.message);
                window.location.replace("/item/itemDetailPage/" + itemId);
            }
            else {
                alert(result.message);
            }

        });
    });

    $('body').on('click', '#addToCartButton', function () {
        $("#addToCartButton").hide();

        $("#confirmAddToCartDiv").show();
    });

    $('body').on('click', '#addToCartButtonCancel', function () {
        $("#addToCartButton").show();

        $("#confirmAddToCartDiv").hide();
    });

    //monitor the addToCartButtonConfirm (when user confirm they want to add the item into the cart), will call this function
    $('body').on('click', '#addToCartButtonConfirm', function () {

        if (!loginCheck()) {
            window.location.replace("/signInUp/loginPage");
            return;
        }

        let itemId = $("#addToCartButtonConfirm").val();

        let quantity = $("#addToCartNumberInput").val();

        //check for the input quantity
        //check whether the input is a number, and whether is a int, and is > 0
        if ($.isNumeric(quantity) && Math.floor(quantity) == quantity && quantity > 0) {
            let userId = $.cookie("userId");

            let data = { itemId: itemId, quantity: quantity, userId: userId };

            let route = '/user/addToCart';

            $.post(route, data, function (result) {

                if (result.valid) {
                    alert(result.message);
                    window.location.replace("/item/itemDetailPage/" + itemId);
                }
                else {
                    alert(result.message);
                }

            });
        }
        else {
            alert("Please enter a valid number");
        }

    });

    $('body').on('click', '#checkOutButton', function () {

        $("#confirmCheckOutDiv").show();
        $("#uploadPeopleDiv").hide();

    });

    $('body').on('click', '#checkOutButtonCancel', function () {

        $("#checkOutButton").show();

        $("#confirmCheckOutDiv").hide();


    });

    //monitor the checkOutButtonConfirm to check whether user wanted to directed check out
    $('body').on('click', '#checkOutButtonConfirm', function () {
        if (!loginCheck()) {
            window.location.replace("/signInUp/loginPage");
            return;
        }

        let itemId = $("#checkOutButtonConfirm").val();

        let quantity = $("#addToCartNumberInput").val();

        if ($.isNumeric(quantity) && Math.floor(quantity) == quantity && quantity > 0) {
            let userId = $.cookie("userId");

            let paymentMethod = $("#purchaseMethodSelection").val();

            let data = { itemId: itemId, quantity: quantity, userId: userId, paymentMethod: paymentMethod };

            let route = '/user/directCheckOut';

            $.post(route, data, function (result) {

                if (result.valid) {
                    alert(result.message);

                    let userId = $.cookie("userId");

                    window.location.replace("/user/getUserProfilePage/" + userId);
                }
                else {
                    alert(result.message);
                }

            });
        }
        else {
            alert("Please enter a valid number");
        }
    });

    $('body').on('click', '#virtualTryOnButton', function () {

        let element = document.getElementById("downloadHerfHidden");
        console.log(element);
        element.click();


        $("#uploadPeopleDiv").show();
        $("#confirmCheckOutDiv").hide();

    });

    $('body').on('click', '#runVirtualTryOn', function () {
        let people = $('#people')[0].files[0];
        let cloth = $('#cloth')[0].files[0];

        console.log(people, cloth);

        const form = new FormData();
        form.append("personImage", people);
        form.append("clothImage", cloth);

        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://virtual-try-on2.p.rapidapi.com/clothes-virtual-tryon",
            "method": "POST",
            "headers": {
                "X-RapidAPI-Key": "416d634864mshb30fe9377021488p1a34dfjsna99d8f3d0f77",
                "X-RapidAPI-Host": "virtual-try-on2.p.rapidapi.com"
            },
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": form
        };

        $.ajax(settings).done(function (response) {

            let data = $.parseJSON(response)

            console.log(data);

            console.log(data.response.ouput_path_img);

            alert(data.message);

            $("#itemImg").attr("src", data.response.ouput_path_img);
        });
    });

    $('body').on('click', '#runVirtualTryOnCancel', function () {

        $("#uploadPeopleDiv").hide();

        $("#virtualTryOnButton").show();



    });



});


