let TechTeam = require("../models/techTeam");
let User = require("../models/user");
let Business = require("../models/business");
let Item = require("../models/item");


module.exports.getTechManagementPage = function (req, res) {

    let techUserId = req.params.techUserId;

    TechTeam.findTechUserById(techUserId, function (err, techInfo) {
        if (err) {
            console.log(err);
            res.send({
                valid: false,
                message: "Something went wrong",
            });
        } else {
            if (techInfo.length == 1) {
                User.getAllUsers(function (err, allUsers) {
                    if (err) {
                        console.log(err);
                    } else {
                        Business.getAllBusiness(function (err, allBusiness) {
                            if (err) {
                                console.log(err);
                            } else {
                                res.render("techTeamManagementPage", {
                                    allUsers: allUsers,
                                    allBusiness: allBusiness
                                });
                            }
                        });
                    }
                });
            }
            else {
                res.send({
                    valid: false,
                    message: "You are not authorized to perform this action"
                });
            }

        }
    });


}


module.exports.banUser = function (req, res) {

    let data = req.body;

    let userId = data.userId;

    let techUserId = data.techUserId;

    TechTeam.findTechUserById(techUserId, function (err, techInfo) {
        if (err) {
            console.log(err);
            res.send({
                valid: false,
                message: "Something went wrong",
            });
        } else {
            if (techInfo.length == 1) {
                User.banUser(userId, function (err, _) {
                    if (err) {
                        console.log(err);
                        res.send({
                            valid: false,
                            message: "Something went wrong",
                        });
                    } else {
                        res.send({
                            valid: true,
                            message: "Successfully banned user: " + userId,
                        });
                    }
                });
            }
            else {
                res.send({
                    valid: false,
                    message: "You are not authorized to perform this action"
                });
            }

        }
    });
}

module.exports.unBanUser = function (req, res) {

    let data = req.body;

    let userId = data.userId;

    let techUserId = data.techUserId;

    TechTeam.findTechUserById(techUserId, function (err, techInfo) {
        if (err) {
            console.log(err);
            res.send({
                valid: false,
                message: "Something went wrong",
            });
        } else {
            if (techInfo.length == 1) {
                User.unBanUser(userId, function (err, _) {
                    if (err) {
                        console.log(err);
                        res.send({
                            valid: false,
                            message: "Something went wrong",
                        });
                    } else {
                        res.send({
                            valid: true,
                            message: "Successfully unbanned user: " + userId,
                        });
                    }
                });
            }
            else {
                res.send({
                    valid: false,
                    message: "You are not authorized to perform this action"
                });
            }

        }
    });
}


module.exports.banBusiness = function (req, res) {

    let data = req.body;

    let businessId = data.businessId;

    let techUserId = data.techUserId;

    TechTeam.findTechUserById(techUserId, function (err, techInfo) {
        if (err) {
            console.log(err);
            res.send({
                valid: false,
                message: "Something went wrong",
            });
        } else {
            if (techInfo.length == 1) {
                Business.banBusiness(businessId, function (err, _) {
                    if (err) {
                        console.log(err);
                        res.send({
                            valid: false,
                            message: "Something went wrong",
                        });
                    } else {
                        res.send({
                            valid: true,
                            message: "Successfully banned business: " + businessId,
                        });
                    }
                });
            }
            else {
                res.send({
                    valid: false,
                    message: "You are not authorized to perform this action"
                });
            }

        }
    });
}

module.exports.unBanBusiness = function (req, res) {

    let data = req.body;

    let businessId = data.businessId;

    let techUserId = data.techUserId;

    TechTeam.findTechUserById(techUserId, function (err, techInfo) {
        if (err) {
            console.log(err);
            res.send({
                valid: false,
                message: "Something went wrong",
            });
        } else {
            if (techInfo.length == 1) {
                Business.unBanBusiness(businessId, function (err, _) {
                    if (err) {
                        console.log(err);
                        res.send({
                            valid: false,
                            message: "Something went wrong",
                        });
                    } else {
                        res.send({
                            valid: true,
                            message: "Successfully unbanned business: " + businessId,
                        });
                    }
                });
            }
            else {
                res.send({
                    valid: false,
                    message: "You are not authorized to perform this action"
                });
            }

        }
    });
}

module.exports.deleteUser = function (req, res) {

    let data = req.body;

    let userId = data.userId;

    let techUserId = data.techUserId;

    TechTeam.findTechUserById(techUserId, function (err, techInfo) {
        if (err) {
            console.log(err);
            res.send({
                valid: false,
                message: "Something went wrong",
            });
        } else {
            if (techInfo.length == 1) {
                User.deleteUser(userId, function (err, _) {
                    if (err) {
                        console.log(err);
                        res.send({
                            valid: false,
                            message: "Something went wrong",
                        });
                    } else {
                        res.send({
                            valid: true,
                            message: "Successfully deleted user: " + userId,
                        });
                    }
                });
            }
            else {
                res.send({
                    valid: false,
                    message: "You are not authorized to perform this action"
                });
            }

        }
    });
}

module.exports.deleteBusiness = function (req, res) {

    let data = req.body;

    let businessId = data.businessId;

    let techUserId = data.techUserId;

    TechTeam.findTechUserById(techUserId, function (err, techInfo) {
        if (err) {
            console.log(err);
            res.send({
                valid: false,
                message: "Something went wrong",
            });
        } else {
            if (techInfo.length == 1) {
                Business.deleteBusiness(businessId, function (err, _) {
                    if (err) {
                        console.log(err);
                        res.send({
                            valid: false,
                            message: "Something went wrong",
                        });
                    } else {
                        //delete the item its selling
                        Item.deleteItemsGivenBusinessId(businessId, function (err, _) {
                            if (err) {
                                console.log(err);
                                res.send({
                                    valid: false,
                                    message: "Something went wrong",
                                });
                            } else {
                                res.send({
                                    valid: true,
                                    message: "Successfully deleted business: " + businessId,
                                });
                            }
                        });

                    }
                });
            }
            else {
                res.send({
                    valid: false,
                    message: "You are not authorized to perform this action"
                });
            }

        }
    });
}

module.exports.searchByUserName = function (req, res) {

    let data = req.query;

    let userName = data.searchByUserHiddenInput;

    User.getUserDetailByNamePartial(userName, function (err, users) {
        if (err) {
            console.log(err);
            console.log("Error when getting user");
            res.render("techTeamManagementPage", {
                allUsers: [],
                allBusiness: []
            });
        }
        else {
            if (users.length === 0) {
                User.searchByExactMatch(userName, function (err, users) {
                    if (err) {
                        console.log(err);
                        console.log("Error when getting user");
                        res.render("techTeamManagementPage", {
                            allUsers: [],
                            allBusiness: []
                        });
                    }
                    else {
                        res.render("techTeamManagementPage", {
                            allUsers: users,
                            allBusiness: []
                        });
                    }
                })
            }
            else {
                res.render("techTeamManagementPage", {
                    allUsers: users,
                    allBusiness: []
                });
            }
        }
    })
}

module.exports.searchByBusinessName = function (req, res) {

    let data = req.query;

    let businessName = data.searchByBusinessHiddenInput;

    Business.getBusinessDetailByNamePartial(businessName, function (err, businesses) {
        if (err) {
            console.log(err);
            console.log("Error when getting business");
            res.render("techTeamManagementPage", {
                allUsers: [],
                allBusiness: []
            });
        }
        else {
            if (businesses.length === 0) {
                Business.searchByExactMatch(businessName, function (err, businesses) {
                    if (err) {
                        console.log(err);
                        console.log("Error when getting business");
                        res.render("techTeamManagementPage", {
                            allUsers: [],
                            allBusiness: []
                        });
                    }
                    else {
                        res.render("techTeamManagementPage", {
                            allUsers: [],
                            allBusiness: businesses
                        });
                    }
                })
            }
            else {
                res.render("techTeamManagementPage", {
                    allUsers: [],
                    allBusiness: businesses
                });
            }
        }
    })
}