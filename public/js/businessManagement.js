$(document).ready(function () {

    $("#viewProfileDiv").show();
    $("#modifyProfileDiv").hide();
    $("#modifyPasswordDiv").hide();
    $("#itemManagementDiv").hide();
    $("#uploadItemDiv").hide();
    $('.editItemDetailDiv').hide()
    $('.viewItemCommentsDiv').hide()

    $('#viewProfileButton').css('background', "#2c7ccc")

    $('body').on('click', '.clickHighLight', function () {
        $('#viewProfileButton').css('backgroud', "pink")
        $(this).css("background", "#2c7ccc")
        $(this).siblings(".clickHighLight").css("background", "")
    })


    // view profile
    $('body').on('click', '#viewProfileButton', function () {
        $("#viewProfileDiv").show();
        $("#modifyProfileDiv").hide();
        $("#modifyPasswordDiv").hide();
        $("#itemManagementDiv").hide();
        $("#uploadItemDiv").hide();
    });

    // modify profile
    $('body').on('click', '#modifyProfileButton', function () {
        $("#buttonArea").show();
        $("#viewProfileDiv").hide();
        $("#modifyProfileDiv").show();
        $('#modifyPasswordDiv').hide();
        $('#itemManagementDiv').hide()
        $("#uploadItemDiv").hide();
    });

    // modify password
    $('body').on('click', '#modifyPasswordButton', function () {
        $("#buttonArea").show();
        $("#viewProfileDiv").hide();
        $("#modifyProfileDiv").hide();
        $('#modifyPasswordDiv').show();
        $('#itemManagementDiv').hide()
        $("#uploadItemDiv").hide();
    });

    $('body').on('click', '#modifyPassword_backButton', function () {
        $("#modifyPasswordDiv").hide();
        $('#viewProfileDiv').show()

    });

    // item management 
    $('body').on('click', '#itemMangementButton', function () {
        $("#buttonArea").show()
        $("#viewProfileDiv").hide()
        $("#modifyProfileDiv").hide()
        $('#modifyPasswordDiv').hide()
        $('#itemManagementDiv').show()
        $("#uploadItemDiv").hide()
    })

    $('body').on('click', '#itemManagement_backButton', function () {
        $("#buttonArea").show();
        $("#itemManagementDiv").hide();
    });

    // disable enable 按钮
    $('#enbleButton').hide()
    // click disable
    $('body').on('click', '#disableButton', function () {
        $('#enbleButton').show()
        $('#disableButton').hide()
        console.log('点击了disable');

    })
    // click enable
    $('body').on('click', '#enbleButton', function () {
        $('#enbleButton').hide()
        $('#disableButton').show()
        console.log('点击了enable');
    })

    $('body').on('click', '#canceEditlItemButton', function () {
        console.log('点击了');
        $('.mask').hide()
        $('.editItemDetailDiv').hide()
    })

    // view item comments, this function will get all the comments made under the selected item
    $('body').on('click', 'button[name="viewCommentsButton"]', function () {
        $('.mask').show()
        $('.viewItemCommentsDiv').show()

        // get item comments
        // let itemId = $('button[name="viewCommentsButton"]').val();

        let itemId = $(this).val();

        let businessId = $.cookie("businessId");

        console.log(itemId);

        let route = '/item/itemCommentsById/' + itemId + '/' + businessId;

        $.get(route, function (res) {
            console.log(route);
            console.log(res);
            if (res.valid) {
                let data = res.data;
                console.log(data);
                $('#viewCommentBody').empty();
                data.forEach(function (item) {
                    let content = `<tr >
                    <td id="reviewerContent">${item.reviewer}</td>
                    <td id="ratingContent">`;
                    for (let i = 0; i < item.rating; i++) {
                        content += '⭐';
                    }
                    content += `</td>
                    <td>
                        ${item.comment}</div>
                    </td>
                    </tr>`;
                    $('#viewCommentBody').append(content);
                });

            }
            else {
                alert(res.message);
            }
        })
    })

    $('body').on('click', '#closeCommentsButton', function () {
        $('.mask').hide()
        $('.viewItemCommentsDiv').hide()
    })

    // upload new item
    $('body').on('click', '#showUploadItemDivButton', function () {
        $("#buttonArea").show()
        $("#viewProfileDiv").hide()
        $("#modifyProfileDiv").hide()
        $('#modifyPasswordDiv').hide()
        $('#itemManagementDiv').hide()
        $("#uploadItemDiv").show()
    });

    $('body').on('click', '#cancelUpload', function () {
        $("#buttonArea").show();
        $("#uploadItemDiv").hide();
    });

    $('body').on('click', '#cancelUpload', function () {
        $("#buttonArea").show();
        $("#uploadItemDiv").hide();
    })


    //monitor this button when user confirm to upload a new item, run this function to upload new item after confirmation
    $('body').on('click', '#uploadItemButton', function () {

        //check whether the user have uploded the cover image

        if (document.getElementById("itemImgInput").files.length == 0) {
            alert("Please upload an item image");
            return;
        }

        //get the basic information
        let itemNameInput = $("#itemNameInput").val();
        let itemBrandInput = $("#itemBrandInput").val();
        let numStockInput = $("#numStockInput").val();
        let itemPriceInput = $("#itemPriceInput").val();

        //check emptu input
        if (itemNameInput.length == 0) {
            alert("Please enter a name");
            return;
        }

        if (itemBrandInput.length == 0) {
            alert("Please enter a brand");
            return;
        }

        //check the input quantity and price is number and is int and greater than 0
        if ($.isNumeric(numStockInput) && Math.floor(numStockInput) == numStockInput && numStockInput > 0
            && $.isNumeric(itemPriceInput) && Math.floor(itemPriceInput) == itemPriceInput && itemPriceInput > 0) {

            let bId = $.cookie("businessId");
            if (bId === undefined) {
                alert("Please login first");
                window.location.href = '/';
            }
            else {
                $("#itemSellerId").val(bId);
                document.getElementById('uploadItemForm').submit();
            }
        }
        else {
            alert("Please enter a valid number");
        }
    });

    // upload new item
    $('body').on('click', '#modifyProfile_confirmButton', function () {
        let title = $("#businessTitleInput").val();
        let email = $("#businessEmailInput").val();
        let description = $("#businessDescriptionInput").val();
        let address = $("#businessAddressInput").val();

        if (title.length == 0 || email.length == 0 || description.length == 0 || address.length == 0) {
            alert("Input cannot be empty");
        }
        else {
            document.getElementById('updateBusinessProfileForm').submit();
        }
    });

    $('body').on('click', '#modifyPassword_confirmButton', function () {

        let businessId = $.cookie("businessId");

        let newPassword = $("#newPasswordInput").val();
        let confirmPassword = $("#confirmPasswordInput").val();

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (newPassword === "" || confirmPassword === "") {
            alert("Passwords is required");
            return;
        }

        let currentPassword = $("#currentPasswordInput").val();

        if (currentPassword == newPassword) {
            alert("New password cannot be the same as current password");
            return;
        }

        if (currentPasswordInput == "") {
            alert("Please enter current password");
            return;
        }

        let data = { businessId: businessId, currentPassword: currentPassword, newPassword: newPassword };

        let route = '/business/updateBusinessPassword';

        $.post(route, data, function (result) {
            alert(result.message);
            if (result.valid) {
                window.location.href = '/business/businessManagementPage/' + businessId;
            }
        });
    });

    $('body').on('click', 'button[name="disableButton"]', function () {

        let businessId = $.cookie("businessId");

        let route = '/item/disableItem';

        let itemId = $(this).val();

        let data = { itemId: itemId, businessId: businessId };

        $.post(route, data, function (result) {
            alert(result.message);
            window.location.href = '/business/businessManagementPage/' + businessId;
        });
    });

    $('body').on('click', 'button[name="enbleButton"]', function () {

        let businessId = $.cookie("businessId");

        let route = '/item/enableItem';

        let itemId = $(this).val();

        let data = { itemId: itemId, businessId: businessId };

        $.post(route, data, function (result) {
            alert(result.message);
            window.location.href = '/business/businessManagementPage/' + businessId;
        });
    });

    $('body').on('click', 'button[name="deleteItemButton"]', function () {

        let businessId = $.cookie("businessId");

        let route = '/item/deleteItem';

        let itemId = $(this).val();

        let data = { itemId: itemId, businessId: businessId };

        $.post(route, data, function (result) {
            alert(result.message);
            window.location.href = '/business/businessManagementPage/' + businessId;
        });
    });

    $('body').on('click', 'button[name="editItemButton"]', function () {
        $('.mask').show()
        $('.editItemDetailDiv').show()
        let itemId = $(this).val();
        $('#editItemFormHiddenInputItemId').val(itemId);
        $('#editItemFormHiddenInputBusinessId').val($.cookie("businessId"));

        let route = '/item/getItem/' + itemId;

        $.get(route, function (res) {
            if (res.valid) {
                let data = res.data;

                //update form defualt value based on item current info
                $("#itemNameInputEdit").val(data.title);
                $("#itemBrandInputtEdit").val(data.brand);
                $("#numStockInputtEdit").val(data.stock);
                $("#itemPriceInputtEdit").val(data.price);
                $("#itemCategorySelection_e").val(data.category);
            }
            else {
                alert(res.message);
            }
        })
    })

    // edit item detail
    $('body').on('click', '#confirmEditItemButton', function () {
        $("#editItemForm").submit();
    });

});