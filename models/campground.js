var mongoose = require("mongoose");

// Schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    author: {
        id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
        },
        username: String
    }
});

// Create a model
var Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;