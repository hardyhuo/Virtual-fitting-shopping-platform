let Item = require("../models/item");
let Business = require("../models/business");
let TechTeam = require("../models/techTeam");

module.exports.homeState = function (req, res) {

    Item.getBestSellers(function (err, itemList) {
        if (err) {
            console.log(err);
            res.render("home", {
                itemList: [],
                shopList: []
            });
        }
        else {
            Business.getBestShops(function (err, shopList) {
                if (err) {
                    console.log(err);
                    res.render("home", {
                        itemList: [],
                        shopList: []
                    });
                }
                else {
                    for (let shop of shopList) {
                        shop.rating = Math.floor(shop.rating);
                    }

                    res.render("home", {
                        itemList: itemList,
                        shopList: shopList
                    });
                }
            });
        }
    });

}

