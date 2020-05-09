var express = require("express");
var router  = express.Router({mergeParams: true});

var Campground  = require("../models/campground"),
    Comment     = require("../models/comment");

//New route
router.get("/new", isLoggedIn, function(req, res)
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
router.post("/", isLoggedIn, function(req, res)
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