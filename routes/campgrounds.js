var express     = require("express");
var router      = express.Router();
var middleware  = require("../middleware");

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
router.get("/new", middleware.isLoggedIn, function(req, res)
{
    res.render("campgrounds/new");
});

//Create route
router.post("/", middleware.isLoggedIn, function(req, res)
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
        if(err || !foundCamp)
        {
            req.flash("error", "Campground not found!");
            res.redirect("back");
            console.log(err);
        }
        else
        {
            res.render("campgrounds/show",{campground: foundCamp});
        }
    });
});

//Edit route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) 
{
    Campground.findOne({_id: req.params.id}, function(err, foundCamp)
    {
        if(err)
        {
            req.flash("error", "Can't find campground!");
            res.redirect("/campgrounds");
        }
        else
        {
            res.render("campgrounds/edit", {campground: foundCamp});
        }
    });
});

//Update route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res)
{
    Campground.findOneAndUpdate({_id: req.params.id}, req.body.campground, function(err, updatedCamp)
    {
        if(err)
        {
            req.flash("error", "Can't find campground!");
            res.redirect("/campgrounds");
        }
        else
        {
            req.flash("success", "Campground successfully updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Destroy route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res)
{
    Campground.findOneAndRemove({_id: req.params.id}, function(err)
    {
        if(err)
        {
            res.redirect("/campgrounds");
            req.flash("error", "Can't find campground!");
        }
        else
        {
            req.flash("success", "Campground successfully deleted!");
            res.redirect("/campgrounds");
        }
    });
});

module.exports  = router;