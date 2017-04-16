var express = require("express");
var router = express.Router({mergeParams: true});   // Let this template use the parameters in app.js
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Show the comments form
router.get("/new", middleware.isLoggedIn , function(req, res) {
    var id = req.params.id;
    Campground.findById(id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
    
});

// Create a comment and post it
router.post("/", middleware.isLoggedIn, function(req, res) {
    var id = req.params.id;
    Campground.findById(id, function(err, foundCampground) {
       if (err) {
           console.log(err);
           res.redirect("/campgrounds");
       } else {
           Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash("error", "Something went wrong. We apologize for the inconvenience.")
                    console.log(err);
                } else {
                    // Add username and id to comment
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    // Save the comment in the database
                    comment.save();
                    // Add the newly created comment to the campground
                    foundCampground.comments.push(comment);
                    // Save campground in the database
                    foundCampground.save();
                    req.flash("success", "Successfully create comment.");
                    res.redirect("/campgrounds/" + id); // redirect to SHOW page
                }
            });
       }
    });
});


// EDIT - Display edit form
router.get("/:comment_id/edit", middleware.checkCommentCreator, function(req, res) {
    var comment_id = req.params.comment_id;
    var campground_id = req.params.id;
    Campground.findById(campground_id, function(err, foundCampground) {
        if (err) {
            res.redirect("back");
        } else {
            Comment.findById(comment_id, function(err, foundComment) {
                if (err) {
                    res.redirect("back");
                } else {
                    res.render("comments/edit", {campground: foundCampground, comment: foundComment});   
                }
            });
        }
    });
    
});

// UPDATE - Display the updated comment
router.put("/:comment_id", middleware.checkCommentCreator, function(req, res) {
    var comment_id = req.params.comment_id;
    var campground_id = req.params.id;
    var newComment = req.body.comment;
    Comment.findByIdAndUpdate(comment_id, newComment, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + campground_id);
        }
    });
});

// DELETE - Delete a comment
router.delete("/:comment_id", middleware.checkCommentCreator, function(req, res) {
    var comment_id = req.params.comment_id;
    Comment.findByIdAndRemove(comment_id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});


module.exports = router;
