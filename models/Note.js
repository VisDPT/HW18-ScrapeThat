
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

// Create the Note schema
var NoteSchema = new Schema({
    title: {
        type: String
    },
    body: {
        type: String
    }
});

// B/c the 'ref'ernce is made in the Article to Note, Mongoose will automatically save the ObjectIds of the notes

//  makes Note model with the NoteSchema
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;