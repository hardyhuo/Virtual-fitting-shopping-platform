const starterRoute = "http://localhost:8888/"

$(document).ready(function () {

    let userId = $.cookie("businessId");
    if (userId !== undefined) {
        window.location.href = '/business/businessManagementPage/' + userId;
    }

    $('body').on('click', '#signUpBusinessButton', function () {

        let email = $("#inputEmail").val();
        let businessName = $("#inputBusinessName").val();
        let password = $("#inputPassword").val();
        let confirmPassword = $("#inputConfirmPassword").val();
        let address = $("#inputAddress").val();
        let description = $("#inputBusinessDescription").val();

        if (password === confirmPassword) {
            let data = { email: email, businessName: businessName, address: address, password: password, description: description };

            let route = '/signInUp/signUpBusiness';

            $.post(route, data, function (result) {

                let valid = result.valid;
                let message = result.message;

                alert(message);

                if (valid) {
                    $.cookie('businessId', result.businessId, { expires: 7, path: '/', secure: false });
                    window.location.replace("/business/businessManagementPage");
                }

            });
        }
        else {
            alert("Passwords do not match.");
        }
    });
});