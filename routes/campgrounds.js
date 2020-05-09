var express = require("express");
var router  = express.Router();

var Campground = require("../models/campground");

//Index route
router.get("/", function(req, res)
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
router.get("/new", isLoggedIn, function(req, res)
{
    res.render("campgrounds/new");
});

//Create route
router.post("/", isLoggedIn, function(req, res)
{
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = 
    {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: description, author: author};
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
router.get("/:id", function(req, res)
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

//Middleware
function isLoggedIn(req, res, next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
}

module.exports  = router;