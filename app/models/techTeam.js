let mongoose = require('./db')

let techTeamSchema = new mongoose.Schema({
    userName: String,
    password: String,
    email: String,
    role: {
        type: Number,
        default: 2
    },
    disabled: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false
});

techTeamSchema.statics.addTechUser = function (userName, email, password, callback) {

    let newUser = new TechTeam({
        userName: userName,
        email: email,
        password: password
    });

    newUser.save(callback);
}

techTeamSchema.statics.findTechUserById = function (objectId, callback) {
    return this.find({ '_id': objectId }).exec(callback);
}

techTeamSchema.statics.findTechUserByName = function (userName, callback) {
    return this.find({ 'userName': userName }).exec(callback);
}

techTeamSchema.statics.getTechTeamDetailByEmail = function (email, callback) {
    return this.find({ 'email': email }).exec(callback);
}

let TechTeam = mongoose.model('TechTeam', techTeamSchema, 'techTeam');

module.exports = TechTeam;
