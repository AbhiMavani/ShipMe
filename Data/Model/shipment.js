const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let img = new Schema({
    image: Buffer,
    contentType: String
});

let Shipment = new Schema({
    shipmentCode: {
        type: String,
        // required: 'Shipment can\'t be empty',
        unique: true
    },
    shipmentName: {
        type: String,
        // required: 'Shipment can\'t be empty',
        unique: true
    },
    shipmentType: {
        type: String,
        // required: 'Shipment Type can\'t be empty'
    },
    fromCollection: {
        type: String,
        // required: 'Collection City can\'t be empty'
    },
    toDelivery: {
        type: String,
        // required: 'Delivery City can\'t be empty',
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String,
    },
    shipmentImage: {
        type: img,
    }
});


module.exports = mongoose.model('Shipment', Shipment);