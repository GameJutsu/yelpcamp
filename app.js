var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    seedDB      = require("./seed");

mongoose.connect('mongodb://localhost/yelp_camp_v3', {useNewUrlParser: true, useUnifiedTopology: true});

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
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

//New route
app.get("/campgrounds/new", function(req, res)
{
    res.render("new");
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
            res.render("show",{campground: foundCamp});
        }
    });
});

//Listen
// app.listen(process.env.PORT, process.env.IP, function()
app.listen(8080, "0.0.0.0", function()
{
    console.log("YelpCamp server v3 has started!!!");
});