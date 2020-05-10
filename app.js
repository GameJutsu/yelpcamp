var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    seedDB                  = require("./seed"),
    flash                   = require("connect-flash"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    methodOverride          = require("method-override"),
    User                    = require("./models/user");

//Require routes
var campgroundRoutes        = require("./routes/campgrounds"),
    commentRoutes           = require("./routes/comments"),
    indexRoutes             = require("./routes/index");

app.use(express.static(__dirname + "/public"));
mongoose.connect('mongodb://localhost/yelp_camp_v13', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//Passport configuration
app.use(require("express-session")(
    {
        secret: "It is foolish to fear what we have yet to see and know.",
        resave: false,
        saveUninitialized: false
    }));
    
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Defining global variables
app.use(function(req, res, next)
{
    res.locals.currentUser  = req.user;
    res.locals.error        = req.flash("error");
    res.locals.success      = req.flash("success");
    next();
});

//Routes
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);


//Listen
app.listen(process.env.PORT, process.env.IP, function()
//app.listen(8080, "0.0.0.0", function()
{
    console.log("YelpCamp server v13 has started!!!");
});