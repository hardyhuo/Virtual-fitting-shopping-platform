let Item = require("../models/item");
let Business = require("../models/business");
let User = require("../models/user");

module.exports.itemDetailPage = function (req, res) {

    let data = req.params;

    //get the item id from the query string
    let itemId = data.itemId;

    Item.findItemById(itemId, function (err, itemResult) {
        if (err) {
            console.log("Error when getting item");
            console.log(err);
            return res.status(404).send("Something went wrong");
        } else {

            //if this item id does not exstis in the database return error
            if (itemResult.length == 0) {
                return res.status(404).send("Item seems to be deleted");
            }

            let itemData = itemResult[0];

            let allReviews = [];
            let idList = [];

            //refromat the review list, store all the reviewer id into the idList for further processing
            for (let raw of itemData.reviews) {
                let reviewerId = raw.reviewer;
                let rating = raw.rating;
                let content = raw.comment;

                idList.push(reviewerId);

                //beacause we have not got the name of the reviewer yet, so leave the reviewer as null
                allReviews.push({
                    reviewer: null,
                    reviewerId: reviewerId,
                    rating: rating,
                    content: content
                });
            }

            //based on the idList, get all the coresponding user
            User.getUserListByIdList(idList, function (err, userList) {
                if (err) {
                    console.log("Error when getting user lists");
                    console.log(err);
                } else {
                    //iterate througt the all review list, and if the reviews user id matches the current user id, put the name into the corresponding entry
                    for (let element of allReviews) {
                        let id = element.reviewerId;
                        for (let e of userList) {
                            if (e.id === id) {
                                element.reviewer = e;
                                break;
                            }
                        }
                    }
                    let sellerId = itemData.sellerId;

                    //get information of the seller
                    Business.findBusinessById(sellerId, function (err, businessInfo) {
                        if (err) {
                            console.log("Error when getting business");
                            console.log(err);
                        } else {
                            businessInfo = businessInfo[0];
                            res.render("itemDetailPage", {
                                itemData: itemData,
                                sellerName: businessInfo.title,
                                allReviews: allReviews
                            });
                        }
                    });
                }
            });
        }
    })
}

module.exports.getItem = function (req, res) {

    let data = req.params;

    let itemId = data.itemId;

    Item.findItemById(itemId, function (err, itemInfo) {
        if (err) {
            console.log("Error when get item")
            console.log(err);
            res.send(
                { valid: false }
            );
        } else {
            res.send(
                {
                    valid: true,
                    data: itemInfo[0]
                }
            );
        }
    });
}

function updateBusinessRating(sellerId) {
    Item.findAllItemBySellerId(sellerId, function (err, allItems) {
        if (err) {
            console.log("Error when getting all items");
            console.log(err);
        } else {
            let sum = 0;
            let len = 0;

            for (let item of allItems) {
                for (let re of item.reviews) {
                    sum += re.rating;
                    len += 1;
                }
            }

            let newRating = sum / len;

            Business.updateRating(sellerId, newRating, function (err, _) {
                if (err) {
                    console.log("Error when update business rating");
                    console.log(err);
                }
            })
        }
    })
}

module.exports.addComment = function (req, res) {

    let data = req.body;

    let rating = parseInt(data.rating);
    let itemId = data.itemId;
    let commentContent = data.commentContent;
    let reviewer = data.reviewer;

    let sellerId = data.sellerId;

    Item.addNewComment(reviewer, itemId, commentContent, rating, function (err, addCommentResult) {
        if (err) {
            console.log("Error when add a new comment");
            console.log(err);
            res.send({
                valid: false,
                message: "Error when adding a new comment"
            });
        } else {
            if (addCommentResult.matchedCount == addCommentResult.modifiedCount == 1) {
                updateBusinessRating(sellerId);
                res.send({
                    valid: true,
                    message: "Successfully added a new comment"
                });
            }
            else {
                console.log("Error when adding a new comment");
                res.send({
                    valid: false,
                    message: "Error when adding a new comment"
                });
            }
        }
    });

}

//add new item
//append item id into corresponding business item selling
module.exports.uploadItem = function (req, res) {

    //get the image file from the data and conver into the binary buffer
    let imageData = { data: new Buffer.from(req.file.buffer, 'binary'), contentType: req.file.mimetype };

    let data = req.body;

    let itemName = data.name;
    let itemBrand = data.brand;
    let stock = data.stock;
    let price = data.price;
    let category = data.itemCategory;

    let sellerId = data.sellerId;

    console.log(data);

    //add the new item into the database
    Item.addItem(itemName, itemBrand, imageData, stock, sellerId, price, category, function (err, _) {
        if (err) {
            console.log("Error when add item")
            console.log(err);
            res.redirect('/business/businessManagementPage/' + sellerId);
        } else {
            let itemId = _.id;

            //add the new item id into the corresponding business user's item selling list
            Business.addNewItemSelling(sellerId, itemId, function (err, _) {
                if (err) {
                    console.log("Error when add item to business")
                    console.log(err);
                    res.redirect('/business/businessManagementPage/' + sellerId);
                } else {
                    res.redirect('/business/businessManagementPage/' + sellerId);
                }
            });
        }
    });
}

module.exports.editItem = function (req, res) {

    let imageData = undefined;

    //if the user need to update new cover image, trans the file into binary buffer
    if (req.file !== undefined) {
        imageData = { data: new Buffer.from(req.file.buffer, 'binary'), contentType: req.file.mimetype };
    }

    let data = req.body;

    let itemName = data.name;
    let itemBrand = data.brand;
    let stock = data.stock;
    let price = data.price;
    let category = data.itemCategory;

    let sellerId = data.sellerId;
    let itemId = data.itemId;

    //if user did not upload a new cover image, run the basic update
    if (imageData === undefined) {
        Item.updateBasicProfile(itemId, itemName, itemBrand, stock, price, category, function (err, _) {
            if (err) {
                res.send({
                    valid: false,
                    message: "Error when update item info"
                })
            }
            else {
                // res.send({
                //     valid: true,
                //     message: "Successfully update item info"
                // });
                res.redirect('/business/businessManagementPage/' + sellerId);
            }
        });
    }
    //if user did upload a new cover image, run the update with image
    else {
        Item.updateProfileWithImage(itemId, itemName, itemBrand, stock, price, category, imageData, function (err, _) {
            if (err) {
                res.send({
                    valid: false,
                    message: "Error when update item info"
                })
            }
            else {
                // res.send({
                //     valid: true,
                //     message: "Successfully update item info"
                // });
                res.redirect('/business/businessManagementPage/' + sellerId);
            }

        });
    }

}

module.exports.disableItem = function (req, res) {
    let data = req.body;

    let businessId = data.businessId;
    let itemId = data.itemId;

    Item.findItemById(itemId, function (err, itemInfo) {
        if (err) {
            console.log("Error when get item by id");
            console.log(err);
            res.send({
                valid: false,
                message: "Something went wrong"
            });
        } else {
            if (itemInfo.length == 1) {
                //check whether the item is acutally belongs to the business
                itemInfo = itemInfo[0];
                if (itemInfo.sellerId == businessId) {
                    //disbale this item
                    Item.disableItem(itemId, function (err, _) {
                        if (err) {
                            console.log("Error when disable item");
                            console.log(err);
                            res.send({
                                valid: false,
                                message: "Something went wrong"
                            });
                        }
                        else {
                            res.send({
                                valid: true,
                                message: "Successfully disabled item"
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
            else {
                res.send({
                    valid: false,
                    message: "Something went wrong"
                });
            }
        }
    });
}

module.exports.enableItem = function (req, res) {
    let data = req.body;

    let businessId = data.businessId;
    let itemId = data.itemId;

    Item.findItemById(itemId, function (err, itemInfo) {
        if (err) {
            console.log("Error when get item by id");
            console.log(err);
            res.send({
                valid: false,
                message: "Something went wrong"
            });
        } else {
            if (itemInfo.length == 1) {
                //check whether the item is acutally belongs to the business
                itemInfo = itemInfo[0];
                if (itemInfo.sellerId == businessId) {
                    //enable this item
                    Item.enableItem(itemId, function (err, _) {
                        if (err) {
                            console.log("Error when enable item");
                            console.log(err);
                            res.send({
                                valid: false,
                                message: "Something went wrong"
                            });
                        }
                        else {
                            res.send({
                                valid: true,
                                message: "Successfully enable item"
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
            else {
                res.send({
                    valid: false,
                    message: "Something went wrong"
                });
            }
        }
    });
}

module.exports.deleteItem = function (req, res) {
    let data = req.body;

    let businessId = data.businessId;
    let itemId = data.itemId;

    Item.findItemById(itemId, function (err, itemInfo) {
        if (err) {
            console.log("Error when get item by id");
            console.log(err);
            res.send({
                valid: false,
                message: "Something went wrong"
            });
        } else {
            if (itemInfo.length == 1) {
                //check whether the item is acutally belongs to the business
                itemInfo = itemInfo[0];
                if (itemInfo.sellerId == businessId) {
                    //delete this item
                    Item.deleteItem(itemId, function (err, _) {
                        if (err) {
                            console.log("Error when delete item");
                            console.log(err);
                            res.send({
                                valid: false,
                                message: "Something went wrong"
                            });
                        }
                        else {
                            res.send({
                                valid: true,
                                message: "Successfully delete item"
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
            else {
                res.send({
                    valid: false,
                    message: "Something went wrong"
                });
            }
        }
    });
}

// mia - view item comment
module.exports.viewItemCommentsById = function (req, res) {
    let data = req.params;
    let businessId = data.businessId;
    let itemId = data.itemId;

    Item.findItemById(itemId, function (err, itemInfo) {
        if (err) {
            console.log("Error when get item by id");
            console.log(err);
            res.send({
                valid: false,
                message: "Something went wrong"
            });
        }
        else {
            if (itemInfo.length == 1) {
                itemInfo = itemInfo[0];

                //is the same process as the view all comments as the itme detail page

                let rawReviews = itemInfo.reviews;

                let userIdList = [];

                for (let review of rawReviews) {
                    userIdList.push(review.reviewer);
                }

                User.getUserListByIdList(userIdList, function (err, userList) {
                    if (err) {
                        console.log("Error when getting user lists");
                        console.log(err);
                    } else {

                        for (let review of itemInfo.reviews) {
                            for (let user of userList) {
                                if (review.reviewer === user.id) {
                                    review.reviewer = user.userName;
                                    break;
                                }
                            }
                        }

                        res.send({
                            valid: true,
                            data: itemInfo.reviews
                        })
                    }
                });
            }
            else {
                res.send({
                    valid: false,
                    message: "No item with this id"
                });
            }

        }
    }
    )
}