var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

// Landing page
router.get("/", function(req, res) {
    res.render("landing");
});

// Show sign up form
router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
   var username = req.body.username;
   var password = req.body.password;
   
   User.register(new User({username: username}), password, function(err, user) {
       if (err) {
           req.flash("error", err.message);
           return res.redirect("/register");
       }
       passport.authenticate("local")(req, res, function() {
           req.flash("success", "Welcome to YelpCamp " + user.username)
           res.redirect("/campgrounds");
       })
   })
});

// Show login form
router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: "Incorrect combination of username and password",
    successFlash: "You have successfully logged in"
}), function(req, res) {});

// Logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You have successfully logged out.");
    res.redirect("/campgrounds");
});

module.exports = router;
