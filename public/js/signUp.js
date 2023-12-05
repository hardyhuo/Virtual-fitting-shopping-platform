const starterRoute = "http://localhost:8888/"

$(document).ready(function () {

    let userId = $.cookie("userId");
    if (userId !== undefined) {
        window.location.href = '/';
    }

    //monitor the sign up button when user click
    $('body').on('click', '#signUpButton', function () {

        let email = $("#inputEmail").val();

        if (email === "") {
            alert("Email is required");
            return
        }

        let userName = $("#inputUserName").val();
        if (userName === "") {
            alert("User name is required");
            return
        }

        let password = $("#inputPassword").val();
        if (password === "") {
            alert("Password is required");
            return
        }

        let confirmPassword = $("#inputConfirmPassword").val();
        if (confirmPassword === "") {
            alert("Confirm Password is required");
            return
        }

        let gender = $("#genderSelector").val();
        if (gender === "") {
            alert("Gender is required");
            return
        }

        if (password === confirmPassword) {

            //get all the liked categories from the frontend radio box selection
            let categories = $("[name='catergory']");

            let interestedCategory = [];

            for (let element of categories) {
                if (element.checked) {
                    interestedCategory.push(element.id);
                }
            }

            let data = { email: email, userName: userName, gender: gender, password: password, category: interestedCategory.toString() };

            let route = '/signInUp/signUp';

            $.post(route, data, function (result) {

                let valid = result.valid;
                let message = result.message;

                alert(message);

                if (valid) {
                    $.cookie('userId', result.userId, { expires: 7, path: '/', secure: false });
                    window.location.replace(document.referrer);
                }

            });
        }
        else {
            alert('Passwords do not match');
        }
    });
});