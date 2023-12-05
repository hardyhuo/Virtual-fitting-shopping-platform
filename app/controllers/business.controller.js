let Business = require("../models/business");
let Item = require("../models/item");
let crypto = require('crypto');


module.exports.businessManagementPage = function (req, res) {

    let data = req.params;

    let businessId = data.businessId;

    Business.findBusinessById(businessId, function (err, businessInfo) {
        if (err) {
            console.log("error when get business by id")
            console.log(err);

            res.status(500).send(err);
        }
        else {
            if (businessInfo.length != 1) {
                res.status(500).send("Something went wrong");
            }
            else {
                businessInfo = businessInfo[0];

                let itemIdList = [];

                for (let item of businessInfo.itemSelling) {
                    if (item.itemId !== null) {
                        itemIdList.push(item.itemId);
                    }
                }

                if (itemIdList.length == 0) {
                    res.render("businessManagementPage", {
                        businessInfo: businessInfo,
                        itemSelling: []
                    });
                }
                else {
                    Item.getItemListByIdList(itemIdList, function (err, itemList) {
                        if (err) {
                            res.status(500).send("Something went wrong");
                        }
                        else {
                            res.render("businessManagementPage", {
                                businessInfo: businessInfo,
                                itemSelling: itemList
                            });
                        }
                    });
                }
            }
        }
    });

}

module.exports.businessDetailPage = function (req, res) {

    let data = req.params;

    let businessId = data.businessId;

    Business.findBusinessById(businessId, function (err, businessInfo) {
        if (err) {
            console.log("Error when getting business");
            console.log(err);
        } else {
            businessInfo = businessInfo[0];

            let idList = [];

            for (let id of businessInfo.itemSelling) {
                idList.push(id.itemId);
            }

            Item.getItemListByIdList(idList, function (err, itemList) {
                if (err) {
                    console.log("Error when getting item lists");
                    console.log(err);
                } else {
                    res.render("businessDetailPage", {
                        data: businessInfo,
                        itemSelling: itemList
                    });
                }
            });
        }
    });
}



module.exports.updateBusinessProfile = function (req, res) {

    let data = req.body;

    let newTitle = data.title;
    let newEmail = data.email;
    let newDescription = data.description;
    let newAddress = data.address;
    let businessId = data.businessId;

    Business.updateBasicProfile(businessId, newTitle, newEmail, newDescription, newAddress, function (err, _) {
        if (err) {
            console.log("Error when getting item lists");
            console.log(err);
            res.redirect('/business/businessManagementPage/' + businessId);
        } else {
            res.redirect('/business/businessManagementPage/' + businessId);
        }
    });
}

module.exports.updateBusinessPassword = function (req, res) {

    let data = req.body;

    let businessId = data.businessId;

    let newPassword = data.newPassword;

    let currentPassword = data.currentPassword;

    currentPassword = crypto.createHash('md5').update(currentPassword).digest('hex');

    let specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    let valid = true;
    let message = "Update Password Successful";

    if (specialChars.test(newPassword)) {
        valid = false;
        message = "Password cannot contain special characters";
    }
    else if (newPassword.length < 6 || newPassword.length > 10) {
        valid = false;
        message = "Password must be 6 to 10 characters long";
    }

    if (valid) {
        Business.findBusinessById(businessId, function (err, businessInfo) {
            if (err) {
                console.log("erro when getting business info");
                console.log(err);
                res.send({
                    valid: false,
                    message: "Something went wrong when getting business info"
                });
            }
            else {
                businessInfo = businessInfo[0];
                if (businessInfo.password !== currentPassword) {
                    res.send({
                        valid: false,
                        message: "Invalid current password"
                    });
                }
                else {
                    newPassword = crypto.createHash('md5').update(newPassword).digest('hex');
                    Business.updatePassword(businessId, newPassword, function (err, _) {
                        if (err) {
                            res.send({
                                valid: false,
                                message: "Something went wrong when updating password"
                            });
                        }
                        else {
                            res.send({
                                valid: true,
                                message: message
                            });
                        }
                    });
                }
            }
        });
    }
    else {
        res.send({
            valid: false,
            message: message
        });
    }
}