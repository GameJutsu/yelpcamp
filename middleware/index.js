var Campground      = require("../models/campground");
var Comment         = require("../models/comment");
var middlewareObj   = {};

middlewareObj.isLoggedIn    = function(req, res, next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};


middlewareObj.checkCampgroundOwnership  = function(req, res, next)
{

    if(req.isAuthenticated())
    {
        Campground.findOne({_id: req.params.id}, function(err, foundCamp)
        {
            if(err || !foundCamp)
            {
                req.flash("error", "Campground not found!");
                res.redirect("back");
            }
            else
            {
                if(foundCamp.author.id.equals(req.user._id))
                {
                    next();
                }
                else
                {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    }
    else
    {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership  = function(req, res, next)
{
    if(req.isAuthenticated())
    {
        Comment.findOne({_id: req.params.comment_id}, function(err, foundComment)
        {
            if(err || !foundComment)
            {
                req.flash("error", "Comment not found!");
                res.redirect("back");
            }
            else
            {
                if(foundComment.author.id.equals(req.user._id))
                {
                    next();
                }
                else
                {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    }
    else
    {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};



module.exports      = middlewareObj;