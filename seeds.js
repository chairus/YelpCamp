var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Yosemite National Park",
        image: "https://lovelace-media.imgix.net/uploads/20/2b3a7b30-b600-0131-92da-76123c8e5fa3.jpg?w=740&h=500&fit=crop&crop=faces&auto=format&q=70",
        description: "Ninety-five percent of Yosemite National Park is designated wilderness, which means no cars, no buildings, and no electricity. Sleep under the stars and hike up to Glacier Point for a view of Yosemite Valley, Half Dome, and Yosemite Falls. Make sure you store your food properly though — black bears are common!"
    },
    {
        name: "Shenandoah National Park",
        image: "https://lovelace-media.imgix.net/uploads/20/2c77d6f0-b605-0131-4925-0eb5cee09ce1.jpg?w=740&h=494&fit=crop&crop=faces&auto=format&q=70",
        description: "Conveniently located just 75 miles from Washington, D.C., Shenandoah National Park makes for the perfect nature retreat. You'll find 101 miles of the Appalachian Trail and just overall peaceful, wild beauty. Hike away the weekend among the park's many waterfalls."
    },
    {
        name: "Boya Lake Provincial Park",
        image: "https://lovelace-media.imgix.net/uploads/20/2c716550-b605-0131-568e-023a6d66c206.jpg?w=740&h=555&fit=crop&crop=faces&auto=format&q=70",
        description: "Boya Lake Provincial Park, renowned for the color and clarity of its lake, is a great place to enjoy any type of water recreation. The lake is also one of the few in the north that's warm enough for swimming. The area was carved out by glaciers, leaving many islands and lakes behind for modern campers to explore on the park's hiking trails."
    },
    {
        name: "Miyajima",
        image: "https://lovelace-media.imgix.net/uploads/20/2c731ce0-b605-0131-e000-1e13ab793288.jpg?w=740&h=555&fit=crop&crop=faces&auto=format&q=70",
        description: "Hey, the island of Miyajima is just a short boat ride away from Hiroshima. You can pitch your tent here year-round, or rent a cabin. The island is speckled with temples if you like a little culture with your camping. But the best part of staying on Miyajima? Walking among the domesticated deer that populate the island."
    }
];



function seedDB() {
    // Remove all campgrounds
    Campground.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Removed Campgrounds!");
        }
        
        // Add a few campgrounds
        data.forEach(function(seed) {
            Campground.create(seed, function(err, campground) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Added a campground");
                    // Create a comment
                    Comment.create({
                        text: "This place was great , but I wish there was Internet",
                        author: "Homer"
                    }, function(err,comment) {
                        if (err) {
                            console.log(err);
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created new comment");
                        }
                    })
                }
            });
        });
        
    });
        
    
};
    
module.exports = seedDB;