const mongoose = require('mongoose');
Schema = mongoose.Schema;

let Receipt = new Schema({
    user_name: String,
    shipmentCode: String,
    ackReceipt: {
        receiptPDF: Buffer,
        contentType: String
    },
});

module.exports = mongoose.model('Receipt', Receipt);