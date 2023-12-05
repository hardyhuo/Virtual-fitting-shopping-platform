const starterRoute = "http://localhost:8888/"

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

    //monitor the login button, whenever user click the login button, will run this function
    $('body').on('click', '#loginButton', function () {

        //get the email and password from the user input
        let email = $("#inputEmail").val();
        let password = $("#inputPassword").val();

        //basic empty input checking
        if (email === "") {
            alert("Email is required");
            return
        }

        if (password === "") {
            alert("Password is required");
            return
        }

        //wrapped the data in a JSON form
        let data = { email: email, password: password };

        //target customer login endpoint
        let route = '/signInUp/login';

        //axios post requet
        $.post(route, data, function (result) {

            //if the oepration is valid (success)
            if (result.valid) {
                let userId = result.userId;

                //To set a cookie
                $.cookie('userId', userId, { expires: 7, path: '/', secure: false });


                //just to make sure we get ride of the previous login status
                let bId = $.cookie("businessId");

                if (bId !== undefined) {
                    $.removeCookie('businessId', { path: '/' });
                }

                let tId = $.cookie("techTeamId");

                if (tId !== undefined) {
                    $.removeCookie('techTeamId', { path: '/' });
                }

                alert(result.message);

                //redirect to the previous page (for the sake of better usability)
                window.location.replace(document.referrer);
            } else {
                alert(result.message);
            }

        });
    });
});