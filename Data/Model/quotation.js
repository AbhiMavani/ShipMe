 const mongoose = require('mongoose'),
     Schema = mongoose.Schema;

 let Quotation = new Schema({

     shipmentCode: String,
     transporterId: String,
     amount: String,
     services: [Schema.Types.String],
     comment: String,
     status: String
 });

 module.exports = mongoose.model('Quotation', Quotation);