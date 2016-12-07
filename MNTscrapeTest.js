/* Scraper Template  (18.10) 
 * ========================= */


// Snatches HTML from URLs
var request = require('request');
// Scrapes our HTML
var cheerio = require('cheerio');

// Make a request call to grab the HTML body from the site of your choice
request('http://www.medicalnewstoday.com/', function(error, response, html) {

    var $ = cheerio.load(html);
    //TOP STORIES
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
    });
    //MORE STORIES
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
    });


});

// request('http://www.medicalnewstoday.com/', function(error, response, html) {
//     // load the html body from request into cheerio
//     var $ = cheerio.load(html);
//     // for each element with a "title" class
//     var result = [];
//     $('.full .headlines_split .writtens_top .written').each(function(i, element) {

//         var title = $(element).children().attr("title");
//         var title = $(element).children().attr("title");
//         //var para = $(this).text();


//         //var blurb = $(".written .headline ").text();
//         var link = $(element).children().attr("href");
//         link = "http://www.medicalnewstoday.com" + link;

//         console.log(title);
//         //console.log(para);
//         //console.log(blurb);
//         console.log(link);
//         console.log("=============================================");
//     });

// });