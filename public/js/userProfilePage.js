const selectedBackgroundClass = "btn btn-success";
const unselectedBackgroundClass = "btn btn-secondary";

$(document).ready(function () {

    let userId = $.cookie("userId");
    if (userId === undefined) {
        window.location.href = '/';
    }

    $("#confirmProfileModifyButton").hide();

    $("#changePasswordDiv").hide();

    $('.modifyFormElements').hide();

    $('body').on('click', '#cancelProfileModifyButton', function () {
        $("#modifyProfileButton").show();
        $("#changePasswordButton").show();
        $('.modifyFormElements').hide();
    });

    $('body').on('click', '#modifyProfileButton', function () {
        $("#modifyProfileButton").hide();
        $("#changePasswordButton").hide();
        $('.modifyFormElements').show();
    });

    $('body').on('click', '#changePasswordButton', function () {
        $('#changePasswordDiv').show();
        $("#modifyProfileButton").hide();
        $('#changePasswordButton').hide();
    });

    $('body').on('click', '#cancelUpdatePasswordButton', function () {
        $('#changePasswordDiv').hide();
        $("#modifyProfileButton").show();
        $('#changePasswordButton').show();
    });

    //monitor the confirmProfileModifyButton, whenever user clicked the submit button, will call this function to update the user profile
    $('body').on('click', '#confirmProfileModifyButton', function () {
        let email = $("#userEmailInput").val();

        if (email === "") {
            alert("Email is required");
            return
        }

        let userName = $("#userNameInput").val();
        if (userName === "") {
            alert("User name is required");
            return
        }

        let gender = $("#genderSelector").val();
        if (gender === "") {
            alert("Gender is required");
            return
        }

        let categories = $("[name='catergory']");

        let interestedCategory = [];

        for (let element of categories) {
            if (element.checked) {
                interestedCategory.push(element.id);
            }
        }

        //get user id from cookie
        userId = $.cookie("userId");
        if (userId === undefined) {
            window.location.href = '/';
            return;
        }

        //wrapped the data into JSON
        let data = { userId: userId, email: email, userName: userName, gender: gender, category: interestedCategory.toString() };

        let route = '/user/updateProfile';

        $.post(route, data, function (result) {

            let valid = result.valid;
            let message = result.message;

            alert(message);

            if (valid) {
                window.location.href = '/user/getUserProfilePage/' + userId;
            }

        });
    });

    $('body').on('click', '#updatePasswordButton', function () {

        userId = $.cookie("userId");

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

        let data = { userId: userId, currentPassword: currentPassword, newPassword: newPassword };

        let route = '/user/updatePassword';

        $.post(route, data, function (result) {
            alert(result.message);
            if (result.valid) {
                window.location.href = '/user/getUserProfilePage/' + userId;
            }
        });
    });
});