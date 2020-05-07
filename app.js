var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seed");

mongoose.connect('mongodb://localhost/yelp_camp_v4', {useNewUrlParser: true, useUnifiedTopology: true});

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

seedDB();

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
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
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
app.get("/campgrounds/:id/comments/new", function(req, res)
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
app.post("/campgrounds/:id/comments", function(req, res)
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

//Listen
// app.listen(process.env.PORT, process.env.IP, function()
app.listen(8080, "0.0.0.0", function()
{
    console.log("YelpCamp server v4 has started!!!");
});