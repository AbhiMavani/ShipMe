const mongoose = require('mongoose'),
    Schema = mongoose.Schema;



let LivePath = new Schema({
    user_name: String,
    shipmentCode: String,
    lat:Number,
    lng:Number,
});


module.exports = mongoose.model('LivePath', LivePath);
