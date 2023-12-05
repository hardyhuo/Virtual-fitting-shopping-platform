const { isObjectIdOrHexString } = require('./db');
let mongoose = require('./db')

let itemSchema = new mongoose.Schema({
    title: String,
    brand: String,
    imageData: [{ data: Buffer, contentType: String }],
    stock: Number,
    sellerId: String, //the business id of the business this item belongs to
    price: Number,
    category: String,
    totalSold: {
        type: Number,
        default: 0
    },
    disabled: {
        type: Boolean,
        default: false
    },
    reviews: [{
        reviewer: String, //user id
        rating: Number,
        comment: String
    }]
}, {
    versionKey: false
});

itemSchema.statics.getBestSellers = function (callback) {
    return this.aggregate([{
        "$project": {
            "_id": 1,
            "title": 1,
            "brand": 1,
            "price": 1,
            "imageData": 1,
            "disabled": 1,
            "averageRating": {
                "$avg": "$reviews.rating"
            },
            "reviewsSize": { "$size": "$reviews" }
        }
    },
    {
        "$match": {
            "reviewsSize": { "$gte": 2 },
            "disabled": false
        }
    },
    { "$sort": { "averageRating": -1 } },
    { "$limit": 5 }
    ]).exec(callback);
}

itemSchema.statics.addNewComment = function (userId, itemId, comment, rating, callback) {
    let review = {
        reviewer: userId,
        rating: rating,
        comment: comment
    }

    return this.updateOne({ _id: itemId }, { $push: { reviews: { $each: [review], $position: 0 } } }).exec(callback);
}

itemSchema.statics.addItem = function (title, brand, imageData, stock, sellderId, price, category, callback) {
    let newItem = new Item({
        title: title,
        brand: brand,
        imageData: imageData,
        stock: stock,
        sellerId: sellderId,
        price: price,
        category: category,
        disabled: false,
        reviews: []
    })

    newItem.save(callback)
}

itemSchema.statics.findItemById = function (objectId, callback) {
    return this.find({ '_id': objectId }).lean().exec(callback);
}

itemSchema.statics.findItemByTitle = function (title, callback) {
    return this.find({
        'title': { $regex: new RegExp(title, "i") }
    }).lean().exec(callback);
}

itemSchema.statics.searchByExactMatch = function (title, callback) {
    return this.find({
        'title': title
    }).lean().exec(callback);
}

// itemSchema.statics.findItemByTitle = function (keyword, callback) {
//     return this.find({'$or':[
//         { 'title': {'$regex': keyword, '$options': 'i'}},
//         { 'brand': {'$regex': keyword, '$options': 'i'}},
//         { 'category': {'$regex': keyword, '$options': 'i'}}
//     ]}).exec(callback);
// }

itemSchema.statics.findAll = function (callback) {
    return this.find({}).lean().exec(callback);
}

itemSchema.statics.findAllItemBySellerId = function (sellerId, callback) {
    return this.find({ 'sellerId': sellerId }).lean().exec(callback);
}


itemSchema.statics.getItemListByIdList = function (idList, callback) {
    return this.find({ '_id': { $in: idList } }).lean().exec(callback);
}

itemSchema.statics.updateRemainingStockAndTotalSold = function (itemId, numSold, callback) {

    return this.updateOne({
        _id: itemId
    },
        {
            $inc: {
                totalSold: numSold,
                stock: -numSold
            }
        }).exec(callback);
}

itemSchema.statics.getItemListByIdList = function (idList, callback) {
    return this.find({ '_id': { $in: idList } }).exec(callback);
}

itemSchema.statics.deleteItemsGivenBusinessId = function (businessId, callback) {
    return this.deleteMany({ sellerId: businessId }).exec(callback)
}

itemSchema.statics.disableItem = function (itemId, callback) {
    return this.updateOne({ _id: itemId }, { "disabled": true }).exec(callback);
}

itemSchema.statics.enableItem = function (itemId, callback) {
    return this.updateOne({ _id: itemId }, { "disabled": false }).exec(callback);
}

itemSchema.statics.deleteItem = function (itemId, callback) {
    return this.deleteOne({ _id: itemId }).exec(callback);
}

itemSchema.statics.updateBasicProfile = function (itemId, title, brand, stock, price, category, callback) {
    return this.updateOne(
        {
            _id: itemId
        },
        {
            $set: {
                title: title,
                brand: brand,
                stock: stock,
                price: price,
                category: category
            }
        }).exec(callback);
}

itemSchema.statics.updateProfileWithImage = function (itemId, title, brand, stock, price, category, imageData, callback) {
    return this.updateOne(
        {
            _id: itemId
        },
        {
            $set: {
                title: title,
                brand: brand,
                stock: stock,
                price: price,
                category: category,
                imageData: imageData
            }
        }).exec(callback);
}


let Item = mongoose.model('Item', itemSchema, 'items');

module.exports = Item;
