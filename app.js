/**
 * The file to start a server
 *
 */

let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let pjax = require('express-pjax');

let busboy = require('connect-busboy');


let port = 8888;

let app = express();

const cors = require('cors');
app.use(cors({
    origin: '*'
}));

app.set('views', path.join(__dirname, '/app/views'));

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pjax());

app.use(busboy());


let homeRoutes = require('./app/routes/home.routes');
app.use('/', homeRoutes);
app.use('/testVirtualTryOn', homeRoutes);

let searchRoutes = require('./app/routes/search.routes');
app.use('/search/', searchRoutes);

let signInUpRoutes = require('./app/routes/signInUp.routes');
app.use('/signInUp/', signInUpRoutes);

let businessRoutes = require('./app/routes/business.routes');
app.use('/business/', businessRoutes);

let userRoutes = require('./app/routes/user.routes');
app.use('/user/', userRoutes);

let itemRoutes = require('./app/routes/item.routes');
app.use('/item/', itemRoutes);

let techTeamRoutes = require('./app/routes/techUser.routes');
app.use('/techTeam/', techTeamRoutes);

// Mia - view item comments
let itemCommentsRoutes = require('./app/routes/item.routes')
app.use('/item/', itemCommentsRoutes)

// // Mia - shopping cart
// let shoppingCartRoutes = require('./app/routes/user.routes')
// app.use('/user/', shoppingCartRoutes)

// let shoppingCartData = require('./app/routes/user.routes')
// app.use('/user/', shoppingCartData)


app.listen(port, function () {
    console.log('App listening on http://localhost:' + port);
});

module.exports = app;