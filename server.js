var express = require('express');
var app = express(); //initialize Express
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");



//for Scraping
var request = require('request');
var cheerio = require('cheerio');

// Mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");

mongoose.Promise = Promise;

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));
// Make public a static dir
app.use(express.static("public"));


// Database configuration with mongoose
mongoose.connect("mongodb://localhost/HW18newsScrapeDB");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});





//HANDLEBARS
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// Routes
// ======

// ============== ACTUAL SCRAPE + PUT IN MONGOdb ==============
app.get("/scrape", function(req, res) {

    request("http://www.medicalnewstoday.com/", function(error, response, html) {
        var $ = cheerio.load(html);
        //-----------TOP NEWS
        $('.full .headlines_fresh .writtens_top .written ').each(function(i, element) {

            var result = {};

            result.title = $(element).children().attr("title");
            //var para = $(this).text();
            result.blurb2 = $(element).children().text();
            //var blurb = $(".written .headline ").text();
            result.link = $(element).children().attr("href");
            link = "http://www.medicalnewstoday.com" + result.link;

            console.log(result);
            //console.log(para);
            console.log(result.blurb2)
                //console.log(blurb);
            console.log(result.link);
            console.log("=============================================");

            var entry = new Article(result);

            // Now, save that entry to the db
            entry.save(function(err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(doc);
                }
            });
        });
        //-----------MORE NEWS
        $('.full .headlines_split .writtens_top .written').each(function(i, element) {

            var result = {}

            result.title = $(element).children().attr("title");
            result.blurb2 = $(element).children().text();
            //var blurb = $(".written .headline ").text();
            result.link = $(element).children().attr("href");
            link = "http://www.medicalnewstoday.com" + result.link;

            console.log(result);
            //console.log(para);
            console.log(result.blurb2)
                //console.log(blurb);
            console.log(result.link);
            console.log("=============================================");

            var entry = new Article(result);

            // Now, save that entry to the db
            entry.save(function(err, doc) { //save is a shorthand for if you do not have underscore id, then Insert
                // Log any errors
                if (err) {
                    console.log(err);
                }
                // Or log the doc
                else {
                    console.log(doc);
                }
            });


        });
    });


    // This will send a "Scrape Complete" message to the browser
    //res.send("Latest News Scraped! Booyah!");

});


// Simple index routes
app.get("/", function(req, res) {
    console.log("hit");
    // Find all notes in the notes collection
    Article.find({}, function(error, found) {
        // Log any errors
        if (error) {
            console.log(error);
        } else {
            console.log(found);

            res.render('index', { article: found })
            
                //res.json(found);
        }
    });

});



// ========== To see all scraped articles from DB =============
// This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {
    // Grab every doc in the Articles array
    Article.find({}, function(error, doc) {
        // Log any errors
        if (error) {
            console.log(error);
        }
        // Or send the doc to the browser as a json object
        else {
            res.json(doc);
        }
    });
});

// Grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    Article.findOne({ "_id": req.params.id })
        // ..and populate all of the notes associated with it
        .populate("note")
        // now, execute our query
        .exec(function(error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Otherwise, send the doc to the browser as a json object
            else {
                res.json(doc);
            }
        });
});


// Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    var newNote = new Note(req.body);

    // And save the new note the db
    newNote.save(function(error, doc) {
        // Log any errors
        if (error) {
            console.log(error);
        }
        // Otherwise
        else {
            // Use the article id to find and update it's note
            Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
                // Execute the above query
                .exec(function(err, doc) {
                    // Log any errors
                    if (err) {
                        console.log(err);
                    } else {
                        // Or send the document to the browser
                        res.send(doc);
                    }
                });
        }
    });
});
//========================================

// Listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});