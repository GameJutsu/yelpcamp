var express = require("express");
var router  = express.Router({mergeParams: true});

var Campground  = require("../models/campground"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");

//New route
router.get("/new", middleware.isLoggedIn, function(req, res)
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
router.post("/", middleware.isLoggedIn, function(req, res)
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
                   newComment.author.id = req.user._id;
                   newComment.author.username = req.user.username;
                   newComment.save();
                   foundCamp.comments.push(newComment);
                   foundCamp.save();
                   res.redirect("/campgrounds/" + foundCamp._id);
               }
           });
       }
    });
});


//Edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res)
{
    Comment.findOne({_id: req.params.comment_id}, function(err, foundComment)
    {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});


//Update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res)
{
    Comment.findOneAndUpdate({_id: req.params.comment_id}, req.body.comment, function(err, updatedComment)
    {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res)
{
    Comment.findOneAndRemove({_id: req.params.comment_id}, function(err)
    {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports  = router;