$(document).ready(function () {

    let businessId = $.cookie("businessId");
    if (businessId !== undefined) {
        window.location.href = '/business/businessManagementPage/' + businessId;
    }
    else {
        let techTeamId = $.cookie("techTeamId");
        if (techTeamId !== undefined) {
            window.location.href = '/techTeam/getTechManagementPage/' + techTeamId;
        }
        else {
            let userId = $.cookie("userId");
            if (userId !== undefined) {
                //hide login tag
                $("#loginTag").hide();
                $("#userProfileIcon").show();
                $("#shoppingCartIcon").show();

            }
            else {
                $("#logoutTag").hide();
                $("#recommandationTag").hide();
                $("#userProfileIcon").hide();
                $("#shoppingCartIcon").hide();

            }
        }
    }

});