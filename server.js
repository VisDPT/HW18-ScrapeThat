var express = require('express');
var app = express(); //initialize Express
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Requiring our Note and Article models
// var Note = require("./models/Note.js");
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
mongoose.connect("mongodb://localhost/HW18-newsScrapeDB");
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
// var exphbs = require('express-handlebars');
// app.engine('handlebars', exphbs({
//     defaultLayout: 'main'
// }));
// app.set('view engine', 'handlebars');

// Routes
// ======

// Simple index route
app.get("/", function(req, res) {
    res.send("HW18- SCRAPE THAT; Do a localhost with '/scrape' then a scrape '/all' to see it all");
});

// Retrieve data from the db
app.get("/all", function(req, res) {
    // Find all results from the scrapedData collection in the db
    db.scrapedNews.find({}, function(error, found) {
        // Throw any errors to the console
        if (error) {
            console.log(error);
        }
        // If there are no errors, send the data to the browser as a json
        else {
            res.json(found);
        }
    });
});

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
    res.send("Latest  News Scraped! Booyah!");
});



// Listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});