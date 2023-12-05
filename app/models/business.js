let mongoose = require('./db')

let businessSchema = new mongoose.Schema({
    title: String,
    email: String,
    password: String,
    description: String,
    address: String,
    rating: {
        type: Number,
        default: 1
    },
    role: {
        type: Number,
        default: 1
    },
    disabled: {
        type: Boolean,
        default: false
    },
    itemSelling: [{
        itemId: String,
    }],
    categorySelling: [],
}, {
    versionKey: false
});


businessSchema.statics.getBestShops = function (callback) {
    const sort = { rating: -1 };
    return this.find({ disabled: false }).sort(sort).limit(5).exec(callback);
}

businessSchema.statics.addBusiness = function (businessName, email, description, address, password, callback) {
    return this.create({
        title: businessName,
        email: email,
        password: password,
        description: description,
        address: address
    }).then(callback);
}

businessSchema.statics.getBusinessDetailByNamePartial = function (businessName, callback) {
    return this.find({
        'title': { $regex: new RegExp(businessName, "i") }
    }).exec(callback);
}

businessSchema.statics.searchByExactMatch = function (title, callback) {
    return this.find({
        'title': title
    }).exec(callback);
}

businessSchema.statics.getBusinessDetailByEmail = function (email, callback) {
    return this.find({ 'email': email }).exec(callback);
}

businessSchema.statics.findBusinessById = function (objectId, callback) {
    return this.find({ '_id': objectId }).exec(callback);
}

businessSchema.statics.getAllBusiness = function (callback) {
    return this.find({}).exec(callback);
}

businessSchema.statics.updateRating = function (objectId, newRating, callback) {
    return this.updateOne({ _id: objectId }, { rating: newRating }).exec(callback);
}

businessSchema.statics.findBusinessByName = function (title, callback) {
    return this.find({
        'title': { $regex: new RegExp(title, "i") }
    }).lean().exec(callback);
}

businessSchema.statics.searchByExactMatch = function (title, callback) {
    return this.find({
        'title': title
    }).lean().exec(callback);
}

businessSchema.statics.banBusiness = function (businessId, callback) {
    return this.updateOne({ _id: businessId }, { "disabled": true }).exec(callback);
}

businessSchema.statics.unBanBusiness = function (businessId, callback) {
    return this.updateOne({ _id: businessId }, { "disabled": false }).exec(callback);
}

businessSchema.statics.deleteBusiness = function (businessId, callback) {
    return this.deleteOne({ _id: businessId }).exec(callback);
}

businessSchema.statics.addNewItemSelling = function (bussinessId, itemId, callback) {
    let item = {
        itemId: itemId
    }

    return this.updateOne({ _id: bussinessId }, { $push: { itemSelling: { $each: [item], $position: 0 } } }).exec(callback);
}

businessSchema.statics.updateBasicProfile = function (businessId, title, email, description, address, callback) {
    return this.updateOne(
        {
            _id: businessId
        },
        {
            $set: {
                title: title,
                email: email,
                description: description,
                address: address
            }
        }).exec(callback);
}

businessSchema.statics.updatePassword = function (businessId, newPassword, callback) {
    return this.updateOne({ _id: businessId }, { "password": newPassword }).exec(callback);
}

let Business = mongoose.model('Business', businessSchema, 'business');

module.exports = Business;
