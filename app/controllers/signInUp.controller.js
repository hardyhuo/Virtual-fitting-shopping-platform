let crypto = require('crypto');
let User = require("../models/user");
let Business = require("../models/business");
let TechTeam = require("../models/techTeam");


module.exports.loginPage = function (req, res) {
    res.render("signIn", {});
}


module.exports.signUpPage = function (req, res) {
    res.render("signUp", {});
}

module.exports.loginInBusinessPage = function (req, res) {
    res.render("signInBusiness", {});
}


module.exports.signUpBusinessPage = function (req, res) {
    res.render("signUpBusiness", {});
}

module.exports.signInTechTeamPage = function (req, res) {
    res.render("signInTechTeam", {});
}

module.exports.login = function (req, res) {
    let data = req.body;

    let email = data.email;
    let password = data.password;
    password = crypto.createHash('md5').update(password).digest('hex');

    User.getUserDetailByEmail(email, function (err, user) {
        if (err) {
            console.log("Error here when get user");
            console.log(err);

            res.send({
                valid: false,
                message: "Something went wrong"
            });
        }
        else {

            if (user.length != 0 && password == user[0].password) {

                user = user[0];
                if (!user.disabled) {
                    let userId = user._id;

                    res.send({
                        valid: true,
                        message: "Welcome Back",
                        userId: userId
                    });
                }
                else {
                    res.send({
                        valid: false,
                        message: "You have been banned from this site",
                    });
                }
            } else {
                res.send({
                    valid: false,
                    message: "Login failed invalid email or password",
                });
            }
        }
    });
}

module.exports.loginBusiness = function (req, res) {
    let data = req.body;

    let email = data.email;
    let password = data.password;

    password = crypto.createHash('md5').update(password).digest('hex');

    Business.getBusinessDetailByEmail(email, function (err, business) {
        if (err) {
            console.log("Error here when get business");
            console.log(err);

            res.send({
                valid: false,
                message: "Something went wrong"
            });
        }
        else {

            if (business.length != 0 && password == business[0].password) {

                business = business[0];
                if (!business.disabled) {

                    res.send({
                        valid: true,
                        message: "Welcome Back",
                        businessId: business.id
                    });
                }
                else {
                    res.send({
                        valid: false,
                        message: "You have been banned from this site",
                    });
                }
            } else {
                res.send({
                    valid: false,
                    message: "Login failed invalid email or password",
                });
            }
        }
    });
}

module.exports.loginTechTeam = function (req, res) {
    let data = req.body;

    let email = data.email;
    let password = data.password;

    password = crypto.createHash('md5').update(password).digest('hex');

    TechTeam.getTechTeamDetailByEmail(email, function (err, techTeam) {
        if (err) {
            console.log("Error here when get tech team");
            console.log(err);

            res.send({
                valid: false,
                message: "Something went wrong"
            });
        }
        else {

            if (techTeam.length != 0 && password == techTeam[0].password) {

                techTeam = techTeam[0];
                let techId = techTeam._id;

                res.send({
                    valid: true,
                    message: "Welcome Back",
                    techId: techId
                });
            } else {
                res.send({
                    valid: false,
                    message: "Login failed invalid email or password",
                });
            }
        }
    });
}

/**
CHECK:
- user name and email need to be unique
- userName needs to be at least 1 chars long - 10 characters long
- password needs to be at least 6 chars long - 10 characters long
- no special characters allowed in password and user name
 */
module.exports.signUp = function (req, res) {
    let data = req.body;
    let email = data.email;
    let userName = data.userName;
    let password = data.password;
    let gender = data.gender;
    let interestedCategory = data.category.split(",");

    if (interestedCategory.length === 1 && interestedCategory[0].length === 0) {
        interestedCategory = [];
    }

    let specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    let specialCharsEmail = /[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+/;

    let valid = true;
    let message = "Sign Up Successfully";

    if (specialCharsEmail.test(email)) {
        valid = false;
        message = "Email cannot contain special characters";
    }
    else if (specialChars.test(userName)) {
        valid = false;
        message = "User name cannot contain special characters";
    }
    else if (specialChars.test(password)) {
        valid = false;
        message = "Password cannot contain special characters";
    }
    else if (userName.length < 1 || userName.length > 10) {
        valid = false;
        message = "User name must be 1 to 10 characters long";
    }
    else if (password.length < 6 || password.length > 10) {
        valid = false;
        message = "Password must be 6 to 10 characters long";
    }

    if (valid) {
        //check unique email
        User.getUserDetailByEmail(email, function (err, user) {
            if (err) {
                console.log("Error");
            } else {
                if (user.length == 0) {

                    //check unique user name
                    User.getUserDetailByUserName(userName, function (err, user) {
                        if (err) {
                            console.log("Error");
                        } else {
                            if (user.length == 0) {

                                let passwordEncoded = crypto.createHash('md5').update(password).digest('hex');

                                //valid successfully create a new user
                                User.addUser(userName, email, passwordEncoded, gender, interestedCategory, function () {
                                    User.getUserDetailByEmail(email, function (err, user) {
                                        if (err) {
                                            console.log("Error here when get user");
                                            console.log(err);
                                            valid = false;
                                            message = "Something went wrong";
                                            res.send({
                                                valid: valid,
                                                message: message
                                            });
                                        }
                                        else {
                                            user = user[0];
                                            let userId = user._id;
                                            res.send({
                                                valid: valid,
                                                message: message,
                                                userId: userId
                                            });
                                        }
                                    });
                                });

                            } else {
                                valid = false;
                                message = "This user name is already in use";
                                res.send({
                                    valid: valid,
                                    message: message
                                });
                            }
                        }
                    });

                } else {
                    valid = false;
                    message = "This email is already in use";
                    res.send({
                        valid: valid,
                        message: message
                    });
                }
            }
        });
    }
    else {
        res.send({
            valid: valid,
            message: message
        });
    }
}


module.exports.signUpBusiness = function (req, res) {
    let data = req.body;

    let email = data.email;
    let businessName = data.businessName;
    let address = data.address;
    let password = data.password;
    let description = data.description;

    let specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    let specialCharsEmail = /[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+/;


    let valid = true;
    let message = "Sign Up Successfully";

    if (specialCharsEmail.test(email)) {
        valid = false;
        message = "Email cannot contain special characters";
    }
    else if (specialChars.test(businessName)) {
        valid = false;
        message = "Business name cannot contain special characters";
    }
    else if (specialChars.test(password)) {
        valid = false;
        message = "Password cannot contain special characters";
    }
    else if (businessName.length < 1 || businessName.length > 20) {
        valid = false;
        message = "Business name must be 1 to 20 characters long";
    }
    else if (address.length < 1) {
        valid = false;
        message = "Address cannot be empty";
    }
    else if (password.length < 6 || password.length > 10) {
        valid = false;
        message = "Password must be 6 to 10 characters long";
    }

    if (valid) {
        Business.getBusinessDetailByEmail(email, function (err, business) {
            if (err) {
                console.log("Error here when get business");
                console.log(err);
                valid = false;
                message = "Something went wrong";
                res.send({
                    valid: valid,
                    message: message
                });
            }
            else {
                if (business.length == 0) {
                    let passwordEncoded = crypto.createHash('md5').update(password).digest('hex');
                    //valid successfully create a new user
                    Business.addBusiness(businessName, email, description, address, passwordEncoded, function () {
                        Business.getBusinessDetailByEmail(email, function (err, business) {
                            if (err) {
                                console.log("Error here when get business");
                                console.log(err);
                                valid = false;
                                message = "Something went wrong";
                                res.send({
                                    valid: valid,
                                    message: message
                                });
                            }
                            else {
                                business = business[0];
                                let businessId = business._id;
                                res.send({
                                    valid: valid,
                                    message: message,
                                    businessId: businessId
                                });
                            }
                        });
                    });

                } else {
                    res.send({
                        valid: false,
                        message: "This email is already in use"
                    });
                }
            }
        });
    } else {
        res.send({
            valid: valid,
            message: message
        });
    }
}

module.exports.signUpTechTeam = function (req, res) {
    let data = req.body;
    let email = data.email;
    let userName = data.userName;
    let password = data.password;

    password = crypto.createHash('md5').update(password).digest('hex');

    //check unique email
    TechTeam.getTechTeamDetailByEmail(email, function (err, user) {
        if (err) {
            console.log("Error");
            res.send({
                valid: false,
                message: "Something went wrong when get tech user by email"
            });
        } else {
            if (user.length == 0) {

                //check unique user name
                TechTeam.findTechUserByName(userName, function (err, user) {
                    if (err) {
                        console.log("Error");
                        console.log(err);
                        res.send({
                            valid: false,
                            message: "Something went wrong when get tech user by name"
                        });
                    } else {
                        if (user.length == 0) {
                            TechTeam.addTechUser(userName, email, password, function (err, _) {
                                if (err) {
                                    console.log("Error");
                                    console.log(err);
                                    res.send({
                                        valid: false,
                                        message: "Something went wrong when add tech user"
                                    });
                                }
                                else {
                                    res.send({
                                        valid: true,
                                        message: "Successfully added a new tech user"
                                    });
                                }
                            });
                        } else {
                            res.send({
                                valid: false,
                                message: "This user name is already in use"
                            });
                        }
                    }
                });

            } else {
                res.send({
                    valid: false,
                    message: "This email is already in use"
                });
            }
        }
    });
}