var mongoose    = require("mongoose");
var Campground  = require("./models/campground");
var Comment     = require("./models/comment");

var data = 
[
    {
        name: "Mystic Falls", 
        image: "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Hell's Foot", 
        image: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402__340.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Silent Hill", 
        image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
];

function seedDB()
{
    //Remove all campgrounds
    Campground.deleteMany({}, function(err)
    {
       if(err)
       {
           console.log(err);
       }
       console.log("Removed campgrounds");
       Comment.deleteMany({}, function(err) 
       {
           if(err)
           {
                console.log(err);
           }
           console.log("Removed comments!");
           data.forEach(function(seed)
           {
               Campground.create(seed, function(err, campground)
               {
                   if(err)
                   {
                       console.log(err);
                   }
                   else
                   {
                       console.log("Added a campground");
                       Comment.create(
                       {
                           text: "Great place but no Internet!",
                           author: "Bob"
                       }, function(err, comment)
                       {
                           if(err)
                           {
                               console.log(err);
                           }
                           else
                           {
                               campground.comments.push(comment);
                               campground.save();
                               console.log("Created new comment.");
                           }
                       });
                   }
               });
               
           });
        });
    });
}

module.exports  = seedDB;