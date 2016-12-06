/* Scraper Template  (18.10) 
 * ========================= */


// Students: Using this skeleton, the cheerio documentation,
// and what you've learned in class so far, scrape a website
// of your choice, save it in a result array, and log it to the console.


// Dependencies:

// Snatches HTML from URLs
var request = require('request');
// Scrapes our HTML
var cheerio = require('cheerio');

// Make a request call to grab the HTML body from the site of your choice
request("http://www.medicalnewstoday.com/categories/rehabilitation", function(error, response, html) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);

    // An empty array to save the data that we'll scrape
    var result = [];

    // Select each instance of the HTML body that you want to scrape
    var result = [];
    $(".written").each(function(i, element) {
        //***********************
        // $(".archive-intro p a.className").each(function(i, element) {
        //inside the class archive-intro, find the <p>, inside p find the a tag with class Classname 

        // Scrape information from the web page, put it in an object 
        // and add it to the result array
        var title = $(element).children().attr("title");
        var para = $(this).text();

        var blurb = $(".written a .headline em").text();
        var link = $(element).children().attr("href");

        //console.log(para);
        console.log(title);
        console.log(link);
        console.log(blurb);
        console.log("=============================================")
    });

});