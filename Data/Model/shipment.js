const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let img = new Schema({
    image: Buffer,
    contentType: String
});

let Shipment = new Schema({
    user_name: String,
    shipmentCode: String,
    shipmentName: String,
    shipmentType: String,
    fromCollection: String,
    toDelivery: String,
    startDate: String,
    endDate: String,
    budget: String,
    shipmentImage: {
        image: Buffer,
        contentType: String
    },
});


module.exports = mongoose.model('Shipment', Shipment);