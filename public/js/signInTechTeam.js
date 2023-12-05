$(document).ready(function () {

    let userId = $.cookie("userId");
    if (userId !== undefined) {
        window.location.href = '/';
    }

    let businessId = $.cookie("businessId");
    if (businessId !== undefined) {
        window.location.href = '/business/businessManagementPage/' + businessId;
    }

    let techId = $.cookie("techTeamId");
    if (techId !== undefined) {
        window.location.href = '/techTeam/getTechManagementPage/' + techId;
    }

    $('body').on('click', '#loginButton', function () {

        let email = $("#inputEmail").val();
        let password = $("#inputPassword").val();

        if (email === "") {
            alert("Email is required");
            return
        }

        if (password === "") {
            alert("Password is required");
            return
        }

        let data = { email: email, password: password };

        let route = '/signInUp/loginTechTeam';

        $.post(route, data, function (result) {
            if (result.valid) {
                let techId = result.techId;

                //To set a cookie
                $.cookie('techTeamId', techId, { expires: 7, path: '/', secure: false });

                let uId = $.cookie("userId");

                if (uId !== undefined) {
                    $.removeCookie('userId', { path: '/' });
                }

                let bId = $.cookie("businessId");

                if (bId !== undefined) {
                    $.removeCookie('businessId', { path: '/' });
                }

                alert(result.message);

                window.location.replace("/techTeam/getTechManagementPage/" + techId);
            } else {
                alert(result.message);
            }
        });
    });
});