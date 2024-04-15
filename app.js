const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path=require('path');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
const passport = require('passport');

const app = express();

require('./authontication/passport')(passport);

const db=require('./authontication/keys').Mongouri;
mongoose.connect(db,{useNewUrlParser:true})
    .then(()=>console.log('DB connected'))
    .catch(err=>console.log(err));

    // app.use(express.json());
app.use(express.static('stylesheet'));

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.urlencoded({extended:false}));
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true,
    // cookie:{secure:true}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 8085;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
