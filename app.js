var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    Campground              = require("./models/campground"),
    Comment                 = require("./models/comment"),
    seedDB                  = require("./seed"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    User                    = require("./models/user");

app.use(express.static(__dirname + "/public"));
mongoose.connect('mongodb://localhost/yelp_camp_v6', {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
seedDB();

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

app.use(function(req, res, next)
{
    res.locals.currentUser = req.user;
    next();
});

//Landing route
app.get("/", function(req, res)
{
    res.render("landing");
});

//Index route
app.get("/campgrounds", function(req, res)
{
    Campground.find({}, function(err, allCampgrounds)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

//New route
app.get("/campgrounds/new", function(req, res)
{
    res.render("campgrounds/new");
});

//Create route
app.post("/campgrounds", function(req, res)
{
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description};
    Campground.create
    (
        newCampground,
        function(err, newlyCreated)
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                res.redirect("/campgrounds");
            }
        }
    );
});

//Show route
app.get("/campgrounds/:id", function(req, res)
{
    Campground.findOne({_id: req.params.id}).populate("comments").exec(function(err, foundCamp)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("campgrounds/show",{campground: foundCamp});
        }
    });
});

//=================
//Comments routes
//=================

//New route
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res)
{
    Campground.findOne({_id: req.params.id}, function(err, foundCamp)
    {
       if(err)
       {
           console.log(err);
       }
       else
       {
           res.render("comments/new", {campground: foundCamp});
       }
    });   
});

//Create route
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res)
{
    Campground.findOne({_id: req.params.id}, function(err, foundCamp)
    {
       if(err)
       {
           console.log(err);
           res.redirect("/campgrounds");
       }
       else
       {
           Comment.create(req.body.comment, function(err, newComment)
           {
               if(err)
               {
                   console.log(err);
               }
               else
               {
                   foundCamp.comments.push(newComment);
                   foundCamp.save();
                   res.redirect("/campgrounds/" + foundCamp._id);
               }
           });
       }
    });
});

//===========
//Auth routes
//===========

//Register routes
//Show signup form
app.get("/register", function(req, res)
{
    res.render("register");
});

//handling user signup
app.post("/register", function(req, res)
{
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user)
    {
        if(err)
        {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function()
        {
            res.redirect("/campgrounds");
        });
    });
});

//Login routes
//Show login form
app.get("/login", function(req, res)
{
    res.render("login");
});

//login logic
app.post("/login", passport.authenticate("local",
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res)
{
});

//logout route
app.get("/logout", function(req, res)
{
    req.logout();
    res.redirect("/campgrounds");
});

//Middleware
function isLoggedIn(req, res, next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
}

//Listen
// app.listen(process.env.PORT, process.env.IP, function()
app.listen(8080, "0.0.0.0", function()
{
    console.log("YelpCamp server v6 has started!!!");
});