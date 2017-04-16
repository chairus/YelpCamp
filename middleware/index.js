var Campground = require("../models/campground");
var Comment = require("../models/comment");


// All middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundCreator = function(req, res, next) {
    var id = req.params.id;
    if (req.isAuthenticated()) {
        // Find the campground with provided ID
        Campground.findById(id, function(err, foundCampground) {
            if (err) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();   
                } else {
                    req.flash("error", "You don't have the permission to do that.");
                    res.redirect("back");
                }
            }
        });   
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.checkCommentCreator = function(req, res, next) {
    var comment_id = req.params.comment_id;
    if (req.isAuthenticated()) {
        // Find the comment with provided ID
        Comment.findById(comment_id, function(err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have the permission to do that.");
                    res.redirect("back");
                }
            }
        });   
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("/login");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that.")
    res.redirect("/login");
}


module.exports = middlewareObj;