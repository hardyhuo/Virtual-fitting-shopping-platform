$(document).ready(function () {

    //关于ui - start
    $('#allShopsDiv').hide()

    $('body').on('click', '#businessManagementButton', function () {
        $('#allShopsDiv').show()
        $('#allUsersDiv').hide()
        $('.userGenderTitle').text("Rating")
    })

    $('body').on('click', '#userManagementButton', function () {
        $('#allShopsDiv').hide()
        $('#allUsersDiv').show()
        $('.userGenderTitle').text("Gender")

    })

    // 两个按钮点击高亮显示
    $('body').on('click', '.clickHighLight', function () {
        // console.log('点击了');
        $(this).css("background", "#2c7ccc")
        $(this).siblings(".clickHighLight").css("background", "")
    })

    //关于ui - end

    $('body').on('click', 'button[name="banUserButton"]', function () {

        let userId = $(this).val();

        let techUserId = $.cookie("techTeamId");

        if (confirm("Are you sure you want to ban this user " + userId + " ?") == true) {
            let data = { userId: userId, techUserId: techUserId };

            let route = '/techTeam/banUser';

            $.post(route, data, function (result) {
                alert(result.message);
                if (result.valid) {
                    window.location.replace("/techTeam/getTechManagementPage/" + techUserId);
                }
            });
        }

    });

    $('body').on('click', 'button[name="unBanUserButton"]', function () {

        let userId = $(this).val();

        let techUserId = $.cookie("techTeamId");

        if (confirm("Are you sure you want to unban this user " + userId + " ?") == true) {
            let data = { userId: userId, techUserId: techUserId };

            let route = '/techTeam/unBanUser';

            $.post(route, data, function (result) {
                alert(result.message);
                if (result.valid) {
                    window.location.replace("/techTeam/getTechManagementPage/" + techUserId);
                }
            });
        }

    });

    $('body').on('click', 'button[name="banBusinessButton"]', function () {

        let businessId = $(this).val();

        let techUserId = $.cookie("techTeamId");

        if (confirm("Are you sure you want to ban this business " + businessId + " ?") == true) {
            let data = { businessId: businessId, techUserId: techUserId };

            let route = '/techTeam/banBusiness';

            $.post(route, data, function (result) {
                alert(result.message);
                if (result.valid) {
                    window.location.replace("/techTeam/getTechManagementPage/" + techUserId);
                }
            });
        }

    });

    $('body').on('click', 'button[name="unBanBusinessButton"]', function () {

        let businessId = $(this).val();

        let techUserId = $.cookie("techTeamId");

        if (confirm("Are you sure you want to unban this business " + businessId + " ?") == true) {
            let data = { businessId: businessId, techUserId: techUserId };

            let route = '/techTeam/unBanBusiness';

            $.post(route, data, function (result) {
                alert(result.message);
                if (result.valid) {
                    window.location.replace("/techTeam/getTechManagementPage/" + techUserId);
                }
            });
        }

    });


    $('body').on('click', 'button[name="deleteUserButton"]', function () {

        let userId = $(this).val();

        let techUserId = $.cookie("techTeamId");

        if (confirm("Are you sure you want to delete this user " + userId + " ?") == true) {
            let data = { userId: userId, techUserId: techUserId };

            let route = '/techTeam/deleteUser';

            $.post(route, data, function (result) {
                alert(result.message);
                if (result.valid) {
                    window.location.replace("/techTeam/getTechManagementPage/" + techUserId);
                }
            });
        }

    });

    $('body').on('click', 'button[name="deleteBusinessButton"]', function () {

        let businessId = $(this).val();

        let techUserId = $.cookie("techTeamId");

        if (confirm("Are you sure you want to delete this business " + businessId + " ?") == true) {
            let data = { businessId: businessId, techUserId: techUserId };

            let route = '/techTeam/deleteBusiness';

            $.post(route, data, function (result) {
                alert(result.message);
                if (result.valid) {
                    window.location.replace("/techTeam/getTechManagementPage/" + techUserId);
                }
            });
        }

    });
});