var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

mongoose.connect('mongodb://localhost/yelp_camp_v2', {useNewUrlParser: true, useUnifiedTopology: true});

var campgroundSchema = new mongoose.Schema
(
    {
        name: String,
        image: String,
        description: String
    }
);

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create
// (
//     {
//         name: "Kimono Hill",
//         image: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402__340.jpg",
//         description: "The great view of sky is the pride and joy of Kimono Hill. The rows of flowers do their best to take some of the attention, and the flower bushes and shrubs are surely a sight to behold, but the eye will just be naturally drawn to the lake by the side."
//     },
//     function(err, newCampground)
//     {
//         if(err)
//         {
//             console.log(err);
//         }
//         else
//         {
//             console.log(newCampground);
//         }
//     }
// );

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

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
    Campground.findById(req.params.id, function(err, foundCamp)
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
    // console.log(process.env.PORT);
    // console.log(process.env.IP);
    console.log("YelpCamp server v2 has started!!!");
});