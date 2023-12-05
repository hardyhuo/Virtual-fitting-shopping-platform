let User = require("../models/user");

let Item = require("../models/item");
let crypto = require('crypto');

module.exports.getUserProfilePage = function (req, res) {

    let data = req.params;

    let userId = data.userId;

    User.getUserDetailById(userId, function (err, user) {
        if (err) {
            console.log("Error here when get user");
            console.log(err);
            res.render("home", {});
        }
        else {
            user = user[0];

            //store the list of user's purchased items
            //list of item id
            let itemIdList = [];

            //sort the history in a descending order based on the time
            user.purchaseHistory = user.purchaseHistory.reverse();

            for (let history of user.purchaseHistory) {
                if (!itemIdList.includes(history.itemId)) {
                    itemIdList.push(history.itemId);
                }
            }


            //based on the list of item id to get all the correspondiong items information and return to frontend
            Item.getItemListByIdList(itemIdList, function (err, itemList) {

                let historyList = [];

                //reformat the result to better fit the frontend display
                for (let his of user.purchaseHistory) {
                    for (let ele of itemList) {
                        if (his.itemId === ele.id) {
                            historyList.push({
                                itemId: his.itemId,
                                quantity: his.quantity,
                                paymentMethod: his.paymentMethod,
                                totalPaid: his.totalPaid,
                                purchaseTime: his.time,
                                itemData: ele
                            });
                        }
                    }
                }

                res.render("userProfilePage", {
                    user: user,
                    historyList: historyList
                });

            });

        }
    });
}


module.exports.addToCart = function (req, res) {
    let data = req.body;
    let quantity = parseInt(data.quantity);
    let itemId = data.itemId;
    let userId = data.userId;

    //get the item info from the database based on item id
    Item.findItemById(itemId, function (err, item) {
        if (err) {
            console.log("Error when get item");
            console.log(err);
        }
        else {

            //check whether the item exits
            if (item.length == 0) {
                res.send({
                    valid: false,
                    message: "No matching item found"
                });
            }
            else {
                item = item[0];

                //check remaining stock

                let remainingStock = item.stock;

                //if the item remainingStock is less than the required quantity, return error
                if (remainingStock < quantity) {
                    res.send({
                        valid: false,
                        message: "Shop only have " + remainingStock + " stock left"
                    });
                }
                else {
                    //get the current user info from the database
                    User.getUserDetailById(userId, function (err, user) {
                        if (err) {
                            console.log("Error when getting user");
                            console.log(err);
                        } else {
                            user = user[0];

                            //check whether the user already has this item in their shopping cart

                            let updateShoppingCart = false;
                            let currentQuantity = -1;

                            //go through the current user's shopping cart and check able to find a matching item
                            //if so, means there is already a matching item in the cart, should run update
                            //else, just run append
                            for (let element of user.shoppingCart) {
                                if (element.itemId == itemId) {
                                    updateShoppingCart = true;
                                    currentQuantity = element.quantity;
                                    break;
                                }
                            }

                            let message = "Successfully added " + quantity + " to your shopping cart";

                            if (updateShoppingCart) {
                                //if the current quantity (the quantity of the item already in the cart) plus target (new quantity) is less than the reaming stock
                                //if is greater than the remaining stock, reset the quantity to the maximum (all the reaming stock)
                                if ((currentQuantity + quantity) > remainingStock) {
                                    message = "Shop only have " + remainingStock + " stock left, so we update your cart to the maximum quantity";
                                    quantity = remainingStock;
                                }
                                else {
                                    quantity = currentQuantity + quantity;
                                }

                                User.updateCart(userId, itemId, quantity, function (err, _) {
                                    if (err) {
                                        console.log("Error when update user shopping cart");
                                        console.log(err);
                                    } else {
                                        res.send({
                                            valid: true,
                                            message: message
                                        });
                                    }
                                });
                            }
                            else {
                                User.addToCart(userId, itemId, quantity, function (err, _) {
                                    if (err) {
                                        console.log("Error when add to user shopping cart");
                                        console.log(err);
                                    } else {
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
            }
        }
    });
}


/*
Add purchased item id into endUser.purchaseHistory

update total sold based on purchased quantity in item.totalSold

update remaining stock in item.stock
*/

module.exports.directCheckOut = function (req, res) {

    let data = req.body;

    let quantity = parseInt(data.quantity);
    let itemId = data.itemId;
    let userId = data.userId;
    let paymentMethod = data.paymentMethod;

    if (Number.isInteger(quantity) && quantity > 0) {
        //check item remaining stock

        Item.findItemById(itemId, function (err, itemInfo) {
            if (err) {
                console.log("Error here when get item data");
                console.log(err);
                res.send({
                    valid: false,
                    message: "Something went wrong when getting item data"
                });
            }
            else {
                itemInfo = itemInfo[0];

                let remainingStock = itemInfo.stock;

                //if item still have enough stock
                if (remainingStock >= quantity) {
                    //update total sold and remaining stock
                    Item.updateRemainingStockAndTotalSold(itemId, quantity, function (err, _) {
                        if (err) {
                            console.log("Error here when updating remaining stock");
                            console.log(err);
                            res.send({
                                valid: false,
                                message: "Something went wrong when updating remaining stock and num sold"
                            });
                        }
                        else {
                            let totalPaid = quantity * itemInfo.price;
                            //recrod the current time stamp when finish the purchase
                            const now = Date();
                            User.addToPurchaseHistory(userId, itemId, quantity, paymentMethod, totalPaid, now.toString(), function (err, _) {
                                if (err) {
                                    console.log("Error here when add to purchase history");
                                    console.log(err);
                                    res.send({
                                        valid: false,
                                        message: "Something went wrong when add to purchase history"
                                    });
                                } else {
                                    res.send({
                                        valid: true,
                                        message: "Successfully made a purchase"
                                    });
                                }
                            });
                        }
                    });
                }
                else {
                    res.send({
                        valid: false,
                        message: "Insufficient remaining stock, we only have " + remainingStock + " stock left"
                    });
                }
            }
        });
    }
    else {
        res.send({
            valid: false,
            message: "Please enter a valid quantity"
        });
    }

}

module.exports.updateProfile = function (req, res) {
    //extracr the data sent from the frontend
    let data = req.body;
    let userId = data.userId;
    let email = data.email;
    let userName = data.userName;
    let gender = data.gender;
    let interestedCategory = data.category.split(",");

    if (interestedCategory.length === 1 && interestedCategory[0].length === 0) {
        interestedCategory = [];
    }

    //handle special characters in the input
    //beacsue we do not allowed user to enter certain special characters so we will do this check
    //if the input contains certain special characters, return error to the frontend
    let specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    let specialCharsEmail = /[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+/;

    let valid = true;
    let message = "Successfully update your profile";

    if (specialCharsEmail.test(email)) {
        valid = false;
        message = "Email cannot contain special characters";
    }
    else if (specialChars.test(userName)) {
        valid = false;
        message = "User name cannot contain special characters";
    }
    else if (userName.length < 1 || userName.length > 10) {
        valid = false;
        message = "User name must be 1 to 10 characters long";
    }

    //if passed all the checking
    if (valid) {
        //get user's current profile
        User.getUserDetailById(userId, function (err, userInfo) {
            if (err) {
                console.log("Error when get user by id");
                console.log(err);
                res.send({
                    valid: false,
                    message: "Something went wrong"
                });
            } else {
                //if the current user is not exists in the database, return no user found
                if (userInfo.length == 0) {
                    res.send({
                        valid: false,
                        message: "Sorry, no user found"
                    });
                }
                else {
                    //get the origianl name and email
                    let originalUserName = userInfo[0].userName;
                    let originalUserEmail = userInfo[0].email;

                    //use the new email and new user name to check with the database, whethere there is a duplicate email or user name exists
                    User.findByEmailOrUserName(userName, email, function (err, userInfo) {
                        if (err) {
                            console.log("Error when get user by name or email");
                            console.log(err);
                            res.send({
                                valid: false,
                                message: "Something went wrong"
                            });
                        } else {
                            //if no duplicate, continue
                            if (userInfo.length == 0 || (email == originalUserEmail && userName == originalUserName)) {
                                //update profile
                                User.updateBasicProfile(userId, email, userName, gender, interestedCategory, function (err, _) {
                                    if (err) {
                                        console.log("Error when update profile");
                                        console.log(err);
                                        res.send({
                                            valid: false,
                                            message: "Something went wrong"
                                        });
                                    } else {
                                        res.send({
                                            valid: true,
                                            message: "User profile updated"
                                        });
                                    }
                                });
                            }
                            else {
                                res.send({
                                    valid: false,
                                    message: "User name or email already exists"
                                });
                            }
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

module.exports.updatePassword = function (req, res) {
    let data = req.body;

    let userId = data.userId;

    let newPassword = data.newPassword;

    let currentPassword = data.currentPassword;

    //beacsue we stored the hashed password in the database, so we need to hash the user input first then  do the comparison with the info in the database

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
        //use user id to get the user information from the database
        User.getUserDetailById(userId, function (err, userInfo) {
            if (err) {
                console.log("erro when getting user info");
                console.log(err);
                res.send({
                    valid: false,
                    message: "Something went wrong when getting user info"
                });
            }
            else {
                if (userInfo.length == 0) {
                    res.send({
                        valid: false,
                        message: "Sorry, no user found"
                    });
                }
                else {
                    userInfo = userInfo[0];
                    //compare the current password with the current password inputted by user
                    if (userInfo.password !== currentPassword) {
                        res.send({
                            valid: false,
                            message: "Invalid current password"
                        });
                    }
                    else {
                        newPassword = crypto.createHash('md5').update(newPassword).digest('hex');
                        User.updatePassword(userId, newPassword, function (err, _) {
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


module.exports.getShoppingCartPage = function (req, res) {

    let data = req.params;

    let userId = data.userId;

    User.getUserDetailById(userId, function (err, userInfo) {
        if (err) {
            console.log("Error when get user by id");
            console.log(err);
            res.send({
                valid: false,
                message: "Something went wrong"
            });
        }

        else {
            if (userInfo.length == 1) {

                let userShoppingCart = userInfo[0].shoppingCart;

                let itemIdList = [];

                for (let item of userShoppingCart) {
                    if (!itemIdList.includes(item.itemId)) {
                        itemIdList.push(item.itemId)
                    }
                }

                Item.getItemListByIdList(itemIdList, function (err, itemList) {

                    let shoppingCartList = [];

                    for (let spcit of userShoppingCart) {
                        for (let iti of itemList) {
                            if (spcit.itemId === iti.id) {
                                shoppingCartList.push({
                                    itemId: spcit.itemId,
                                    imageData: iti.imageData,
                                    title: iti.title,
                                    price: iti.price,
                                    quantity: spcit.quantity,
                                    stock: iti.stock
                                });
                            }
                        }
                    }

                    // 显示用户购物车数据

                    res.render("shoppingCart", {
                        valid: true,
                        data: shoppingCartList
                    });

                })
            }

            else {
                res.send({
                    valid: false,
                    message: "No user with this id"
                })
            }

        }
    })
}

module.exports.updateShoppingCartItemQuantity = function (req, res) {
    let data = req.body;

    let itemId = data.itemId;
    let userId = data.userId;

    let newQuantity = parseInt(data.quantity);

    if (newQuantity <= 0) {
        res.send({
            valid: false,
            message: "Invalid quantity"
        });
    }
    else {
        //check item info
        Item.findItemById(itemId, function (err, itemInfo) {
            if (err) {
                console.log("error when get item by id");
                console.log(err);
                res.send({
                    valid: false,
                    message: "Something went wrong"
                });
            }
            else {
                if (itemInfo.length == 1) {
                    itemInfo = itemInfo[0];
                    let remaingStock = itemInfo.stock;
                    if (remaingStock >= newQuantity) {
                        //able to update
                        User.updateCart(userId, itemId, newQuantity, function (err, _) {
                            if (err) {
                                console.log("Error when update user shopping cart");
                                console.log(err);
                                res.send({
                                    valid: false,
                                    message: "Something went wrong"
                                });
                            } else {
                                res.send({
                                    valid: true,
                                    message: "Successfully updated item quantity"
                                });
                            }
                        });
                    }
                    else {
                        //not enough stock to update
                        res.send({
                            valid: true,
                            message: "Insufficient remaining stock, updated your quantity to maximum remaining stock"
                        });
                    }
                }
                else {
                    res.send({
                        valid: false,
                        message: "No matching item found"
                    });
                }
            }

        });
    }
}


module.exports.delteItemFromCart = function (req, res) {
    let data = req.body;

    let itemId = data.itemId;
    let userId = data.userId;

    User.deleteFromCart(userId, itemId, function (err, _) {
        if (err) {
            console.log("Error when delte from user shopping cart");
            console.log(err);
            res.send({
                valid: false,
                message: "Something went wrong"
            });
        } else {
            res.send({
                valid: true,
                message: "Successfully deleted item"
            });
        }
    });
}

module.exports.shoppingCartCheckOut = function (req, res) {
    let data = req.body;

    let userId = data.userId;

    let paymentMethod = data.paymentMethod;

    let itemData = JSON.parse(data.itemData)

    User.getUserDetailById(userId, function (err, userInfo) {
        if (err) {
            console.log("Error when get user by id");
            console.log(err);
            res.send({
                valid: false,
                message: "Something went wrong"
            });
        }
        else {
            if (userInfo.length == 1) {
                userInfo = userInfo[0];

                let itemIdList = [];

                for (let item of itemData) {
                    itemIdList.push(item.itemId);
                }

                //get list of items based on the id list
                Item.getItemListByIdList(itemIdList, function (err, itemList) {

                    if (err) {
                        console.log("Error when get item list by id list");
                        console.log(err);
                        res.send({
                            valid: false,
                            message: "Something went wrong when checkout"
                        });
                    }
                    else {

                        let purchaseRecord = [];

                        const now = Date().toString();

                        for (let item of itemData) {
                            for (let inner of itemList) {
                                if (item.itemId === inner.id) {
                                    purchaseRecord.push({
                                        itemId: item.itemId,
                                        quantity: item.quantity,
                                        paymentMethod: paymentMethod,
                                        totalPaid: inner.price * item.quantity,
                                        time: now
                                    });
                                    break;
                                }
                            }
                        }
                        //add to purchase history

                        User.addMultiToPurchaseHistory(userId, purchaseRecord, function (err, _) {

                            if (err) {
                                console.log("Error when get update purchase history");
                                console.log(err);
                                res.send({
                                    valid: false,
                                    message: "Something went wrong"
                                });
                            }
                            else {

                                //update total sold and remaining stock for each item

                                //this would go instead of async.each(result[0].images...
                                let queryPromises = [];

                                for (let record of purchaseRecord) {
                                    // toArray returns Promise if no callback passed
                                    let queryPromise = Item.updateOne({
                                        _id: record.itemId
                                    },
                                        {
                                            $inc: {
                                                totalSold: record.quantity,
                                                stock: -record.quantity
                                            }
                                        });
                                    //query execution has not started yet, so loop is working fine
                                    queryPromises.push(queryPromise);
                                }

                                Promise.all(queryPromises)
                                    // queries execution starts now
                                    .then(arrayOfResults => {
                                        // do stuff with your results here; results arrive all at once
                                        console.log(arrayOfResults);

                                        //remove items from shopping carts
                                        User.clearCart(userId, function (err, _) {
                                            if (err) {
                                                console.log("Error when clear user shopping cart");
                                                console.log(err);
                                                res.send({
                                                    valid: false,
                                                    message: "Something went wrong"
                                                });
                                            } else {
                                                res.send({
                                                    valid: true,
                                                    message: "Thanks for your puchases"
                                                });
                                            }
                                        });
                                    }, err => {
                                        console.log(err);
                                        res.send({
                                            valid: false,
                                            message: "Something went wrong"
                                        });
                                    });
                            }
                        });

                    }
                });
            }
            else {
                res.send({
                    valid: false,
                    message: "Something went wrong"
                });
            }
        }
    });
}

//distance : Euclidean distance
function knn(allUsers, currentUser) {

    let map = new Map();

    let currentUserId = currentUser.id;
    let currentGender = currentUser.gender;
    let currentInterestCategory = currentUser.interestedCategory;
    let currentPurchaseHistory = [];

    let allPurchaseMap = new Map();

    for (let history of currentUser.purchaseHistory) {
        currentPurchaseHistory.push(history.itemId);
    }

    for (let user of allUsers) {
        let uid = user.id;
        //check not current user
        if (uid !== currentUserId) {
            let score = 0;
            //check mathcing gender
            if (user.gender === currentGender) {
                score += 1;
            }

            //check mathcing interestedCategory
            let matchingInterstedCategory = currentInterestCategory.filter((val, index) => {
                return user.interestedCategory.includes(val)
            })
            score += Math.pow(matchingInterstedCategory.length, 2);


            //check matching purchase history
            let purchaseHistory = [];

            for (let his of user.purchaseHistory) {
                purchaseHistory.push(his.itemId);
            }

            let matcgingPurchaseHistory = currentPurchaseHistory.filter((val, index) => {
                return purchaseHistory.includes(val)
            })
            score += Math.pow(matcgingPurchaseHistory.length, 2)

            map.set(uid, Math.sqrt(score));

            //remove duplicate elements from two purchase history array saved for later use

            let uniq = purchaseHistory.filter(val => !currentPurchaseHistory.includes(val));

            if (uniq.length !== 0) {
                allPurchaseMap.set(uid, uniq);
            }
        }
    }


    //sort by score value
    let sorted = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));

    sorted = Array.from(sorted);

    let output = new Set();;

    const limit = sorted.length <= 3 ? sorted.length : 3;

    for (let i = 0; i < limit; i++) {
        let uid = sorted[i][0];
        if (allPurchaseMap.get(uid) !== undefined) {
            allPurchaseMap.get(uid).forEach(item => output.add(item))
        }
    }

    return output;
}

module.exports.recommendationPage = function (req, res) {
    let data = req.params;

    let userId = data.userId;

    User.getUserDetailById(userId, function (err, userInfo) {
        if (err) {
            console.log("Error get user by id");
            console.log(err);

            res.send({
                valid: false,
                message: "something went wrong"
            });
        } else {

            User.getAllUsers(function (err, allUsers) {
                if (err) {
                    console.log("Error get all users");
                    console.log(err);

                    res.send({
                        valid: false,
                        message: "something went wrong"
                    });
                } else {

                    userInfo = userInfo[0];

                    let recommandationList = knn(allUsers, userInfo);

                    console.log(recommandationList);

                    //if the recommandationList is length 0, just recommend the best sellers
                    if (recommandationList.size == 0) {
                        Item.getBestSellers(function (err, itemList) {
                            if (err) {
                                console.log(err);
                                res.send({
                                    valid: false,
                                    message: "something went wrong"
                                });
                            }
                            else {
                                res.render("recommendationPage", {
                                    recommendationList: itemList
                                });
                            }
                        });
                    }
                    else {

                        Item.getItemListByIdList(Array.from(recommandationList), function (err, itemList) {

                            if (err) {
                                console.log(err);
                                res.send({
                                    valid: false,
                                    message: "something went wrong"
                                });
                            }
                            else {
                                res.render("recommendationPage", {
                                    recommendationList: itemList
                                });
                            }

                        });

                    }
                }
            });

        }
    });
}