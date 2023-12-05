//This file is put here for test only, remove this during actual implementation

let mongoose = require('./db')

let userSchema = new mongoose.Schema({
    userName: String,
    email: String, //This need to be unique
    password: String,
    gender: {
        type: Number,
        default: 0 //0: male, 1: female
    },
    role: {
        type: Number,
        default: 0
    },
    disabled: {
        type: Boolean,
        default: false
    },
    interestedCategory: [],
    shoppingCart: [{
        itemId: String,
        quantity: Number
    }],
    purchaseHistory: [{
        itemId: String,
        quantity: Number,
        paymentMethod: String,
        totalPaid: Number,
        time: String
    }]
}, {
    versionKey: false
});

userSchema.statics.getUserListByIdList = function (idList, callback) {
    return this.find({ '_id': { $in: idList } }).exec(callback);
}

userSchema.statics.getUserDetailById = function (objectId, callback) {
    return this.find({ '_id': objectId }).exec(callback);
}

userSchema.statics.getUserDetailByUserName = function (userName, callback) {
    return this.find({ 'userName': userName }).exec(callback);
}

userSchema.statics.getUserDetailByEmail = function (email, callback) {
    return this.find({ 'email': email }).exec(callback);
}

userSchema.statics.getUserDetailByNamePartial = function (userName, callback) {
    return this.find({
        'userName': { $regex: new RegExp(userName, "i") }
    }).exec(callback);
}

userSchema.statics.searchByExactMatch = function (userName, callback) {
    return this.find({
        'userName': userName
    }).exec(callback);
}


userSchema.statics.getAllUsers = function (callback) {
    return this.find({}).exec(callback);
}

userSchema.statics.addUser = function (userName, email, password, gender, category, callback) {
    return this.create({
        userName: userName,
        email: email,
        password: password,
        gender: gender,
        interestedCategory: category,
        shoppingCart: [],
        purchaseHistory: []
    }).then(callback);
}

userSchema.statics.addToCart = function (userId, itemId, quantity, callback) {
    let item = {
        itemId: itemId,
        quantity: quantity
    }
    return this.updateOne({ _id: userId }, { $push: { shoppingCart: item } }).exec(callback);
}

userSchema.statics.updateCart = function (userId, itemId, quantity, callback) {
    return this.updateOne({
        _id: userId,
        "shoppingCart": { "$elemMatch": { "itemId": itemId } }
    }, {
        $set: { "shoppingCart.$.quantity": quantity }
    }).exec(callback);
}

userSchema.statics.clearCart = function (userId, callback) {
    return this.updateOne({
        _id: userId,
        "shoppingCart": []
    }).exec(callback);
}

userSchema.statics.addToPurchaseHistory = function (userId, itemId, quantity, paymentMethod, totalPaid, time, callback) {
    let item = {
        itemId: itemId,
        quantity: quantity,
        paymentMethod: paymentMethod,
        totalPaid: totalPaid,
        time: time
    }
    return this.updateOne({ _id: userId }, { $push: { purchaseHistory: item } }).exec(callback);
}

userSchema.statics.addMultiToPurchaseHistory = function (userId, data, callback) {
    return this.updateOne({ _id: userId },
        {
            $push:
            {
                purchaseHistory: {
                    $each: data
                }
            }
        }).exec(callback);
}


userSchema.statics.deleteFromCart = function (userId, itemId, callback) {
    return this.updateOne({ _id: userId }, { $pull: { shoppingCart: { itemId: itemId } } }).exec(callback);
}

userSchema.statics.banUser = function (userId, callback) {
    return this.updateOne({ _id: userId }, { "disabled": true }).exec(callback);
}

userSchema.statics.unBanUser = function (userId, callback) {
    return this.updateOne({ _id: userId }, { "disabled": false }).exec(callback);
}

userSchema.statics.deleteUser = function (userId, callback) {
    return this.deleteOne({ _id: userId }).exec(callback);
}

userSchema.statics.updateBasicProfile = function (userId, email, userName, gender, interestedCategory, callback) {
    return this.updateOne(
        {
            _id: userId
        },
        {
            $set: {
                email: email,
                userName: userName,
                interestedCategory: interestedCategory,
                gender: gender
            }
        }).exec(callback);
}

userSchema.statics.findByEmailOrUserName = function (userName, email, callback) {
    return this.find({ $or: [{ userName: userName }, { email: email }] }).exec(callback);
}

userSchema.statics.updatePassword = function (userId, newPassword, callback) {
    return this.updateOne({ _id: userId }, { "password": newPassword }).exec(callback);
}


let User = mongoose.model('User', userSchema, 'endUser')

module.exports = User