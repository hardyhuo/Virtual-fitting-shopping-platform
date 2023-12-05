let mongoose = require('mongoose');

const mongooseUri = "mongodb+srv://comp5347webdev20:comp5347webdev20@ecommerce.m5bws.mongodb.net/eCommerce";


mongoose.connect(mongooseUri, { useNewUrlParser: true }, function () {
    console.log('mongodb connected');
});

module.exports = mongoose;