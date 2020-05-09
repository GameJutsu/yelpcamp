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
router.get("/new", function(req, res)
{
    res.render("campgrounds/new");
});

//Create route
router.post("/", function(req, res)
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

module.exports  = router;