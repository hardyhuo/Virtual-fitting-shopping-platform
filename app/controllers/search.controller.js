let Item = require("../models/item");
let Business = require("../models/business");


module.exports.searchByTitle = function (req, res) {
    let data = req.query;

    let title = data.searchByTitleHiddenInput;

    Item.findItemByTitle(title, function (err, items) {
        if (err) {
            console.log(err);
            console.log("Error when getting items");
        }
        else {
            if (items.length == 0) {
                Item.searchByExactMatch(title, function (err, items) {
                    if (err) {
                        console.log(err);
                        console.log("Error when getting items exact match");
                    }
                    else {

                        if (items[0] !== undefined && items[0].disabled) {
                            items = [];
                        }

                        res.render("searchState", {
                            data: items,
                            searchByItem: true
                        });
                    }
                })
            }
            else {

                let result = [];

                for (let i of items) {
                    if (!i.disabled) {
                        result.push(i);
                    }
                }

                res.render("searchState", {
                    data: result,
                    searchByItem: true
                });
            }
        }
    })
}

module.exports.searchByBusiness = function (req, res) {
    let data = req.query;

    let businessName = data.searchByBusinessHiddenInput;

    Business.findBusinessByName(businessName, function (err, businesses) {
        if (err) {
            console.log(err);
            console.log("Error when getting business");
        }
        else {
            if (businesses.length == 0) {
                Business.searchByExactMatch(businessName, function (err, businesses) {
                    if (err) {
                        console.log(err);
                        console.log("Error when getting businesses exact match");
                    }
                    else {

                        if (businesses[0] == undefined || businesses[0].disabled) {
                            businesses = [];
                        }

                        res.render("searchState", {
                            data: businesses,
                            searchByItem: false
                        });
                    }
                })
            }
            else {

                let result = [];

                for (let i of businesses) {
                    if (!i.disabled) {
                        result.push(i);
                    }
                }

                res.render("searchState", {
                    data: result,
                    searchByItem: false
                });
            }
        }
    })
}