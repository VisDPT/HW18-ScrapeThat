var express = require('express');
var app = express();
var bodyParser = require("body-parser");

//for Scraping
var request = require('request');
var cheerio = require('cheerio');

//db config
var mongojs = require('mongojs');
var databaseUrl = "HW18-newsScrapeDB";
var collections = ["scrapedNews"];

// Hook mongojs config to db variable
var db = mongojs(databaseUrl, collections);

// Log any mongojs errors to console
db.on("error", function(error) {
    console.log("Database Error:", error);
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
            var title = $(element).children().attr("title");
            //var para = $(this).text();
            var blurb2 = $(element).children().text();
            //var blurb = $(".written .headline ").text();
            var link = $(element).children().attr("href");
            link = "http://www.medicalnewstoday.com" + link;

            console.log(title);
            //console.log(para);
            console.log(blurb2)
                //console.log(blurb);
            console.log(link);
            console.log("=============================================");

            // If this title element had both a title and a link
            if (title && link) {
                // Save the data in the scrapedData db
                db.scrapedNews.save({
                        title: title,
                        blurb2: blurb2,
                        link: link
                    },
                    function(error, saved) {
                        // If there's an error during this query
                        if (error) {
                            // Log the error
                            console.log(error);
                        }
                        // Otherwise,
                        else {
                            // Log the saved data
                            console.log(saved);
                        }
                    });
            }
        });
        //-----------MORE NEWS
        $('.full .headlines_split .writtens_top .written').each(function(i, element) {
            var title = $(element).children().attr("title");
            var blurb2 = $(element).children().text();
            //var blurb = $(".written .headline ").text();
            var link = $(element).children().attr("href");
            link = "http://www.medicalnewstoday.com" + link;

            console.log(title);
            //console.log(para);
            console.log(blurb2)
                //console.log(blurb);
            console.log(link);
            console.log("=============================================");
            // If this title element had both a title and a link
            if (title && link) {
                // Save the data in the scrapedData db
                db.scrapedNews.save({
                        title: title,
                        blurb2: blurb2,
                        link: link
                    },
                    function(error, saved) {
                        // If there's an error during this query
                        if (error) {
                            // Log the error
                            console.log(error);
                        }
                        // Otherwise,
                        else {
                            // Log the saved data
                            console.log(saved);
                        }
                    });
            }


        });
    });


    // This will send a "Scrape Complete" message to the browser
    res.send("Latest Rehab News Scraped! Booyah!");
});



// Listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});