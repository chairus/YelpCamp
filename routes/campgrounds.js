var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index");


// INDEX - show all campgrounds
router.get("/", function(req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

// NEW - Show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// CREATE - add new campgrounds to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {
        name: name,
        price: price,
        image: image, 
        description: description,
        author: author
    };
    
    Campground.create(newCampground, function(err, campground) {
            if(err) {
                console.log(err);
            } else {
                res.redirect("/campgrounds");
            }
    });
});

// SHOW - Display information about a specific campground
router.get("/:id", function(req, res) {
    var id = req.params.id;
    // Find the campground with provided ID
    Campground.findById(id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            // Render show template with that campground
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
});

// EDIT - Display the form for editting a campground
router.get("/:id/edit", middleware.checkCampgroundCreator, function(req, res) {
    var id = req.params.id;
    // Find the campground with provided ID
    Campground.findById(id, function(err, foundCampground) {
        if (err) {
            req.flash("error", "Campground not found.");
            console.log(err);
        } else {
            // Render edit template with that campground
            res.render("campgrounds/edit",{campground:foundCampground});
        }
    });
});

// UPDATE - Display campground with editted information
router.put("/:id", middleware.checkCampgroundCreator, function(req, res) {
    var id = req.params.id;
    var newCampgroundData = req.body.campground;
    
    // Find and update the correct campground
    Campground.findByIdAndUpdate(id, newCampgroundData, function(err, foundCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            // Redirect to show page
            res.redirect("/campgrounds/" + id);
        }
    });
});

// DESTROY - Delete a campground
router.delete("/:id", middleware.checkCampgroundCreator, function(req, res) {
    var id = req.params.id;
    
    Campground.findByIdAndRemove(id, function(err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
});


module.exports = router;