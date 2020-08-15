const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let Test = new Schema({
    userName: String,
    finalImg: {
        image: Buffer,
        contentType: String
    }
});

module.exports = mongoose.model('Test', Test);