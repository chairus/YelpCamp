var express                 = require("express");
var bodyParser              = require("body-parser");
var mongoose                = require("mongoose");
var app                     = express();
var passport                = require("passport");
var LocalStrategy           = require("passport-local");
var User                    = require("./models/user");
var seedDB                  = require("./seeds");
var methodOverride          = require("method-override");
var flash                   = require("connect-flash");

var commentRoutes           = require("./routes/comments");
var campgroundRoutes        = require("./routes/campgrounds");
var indexRoutes             = require("./routes/index");


// APP CONFIG;
// mongodb://localhost/yelp_camp
mongoose.connect(process.env.DATABASEURL || "mongodb://localhost/yelp_camp");
// mongoose.connect("mongodb://cyrus:Mfdw-06@ds037617.mlab.com:37617/yelpcamp");
app.use(methodOverride("_method"));
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "I will become the best Full Stack Engineer or Solutions Architect in the universe",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Execute this function on every route(i.e. it makes the 
// variables available to all our "ejs" template.)
// This function sets the "currentUser"
// variable to the current user object(i.e. logged in user).
// It also sets the "error" and "success" variables to req.flash("error")
// and req.flash("success") respectively.
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Exporting/Requiring all routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//seedDB(); // seed the database


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server has started!");
});