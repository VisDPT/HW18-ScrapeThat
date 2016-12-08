var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
    //title, blurb2, and link are required fields
    title: {
        type: String,
        required: true
    },
    blurb2: {
        type: String
    },

    link: {
        type: String,
        required: true
    },
    // JOINS/REFERENCES/for POPULATING in the server.js file; This only saves one note's ObjectId, ref refers to the Note model
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// Makes Article model using ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);


module.exports = Article;