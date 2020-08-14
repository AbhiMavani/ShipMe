const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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

    },
    shipmentImage: {
        type: String
    }
});


module.exports = mongoose.model('Shipment', Shipment);