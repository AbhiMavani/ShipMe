export class Shipment {
    constructor() {}
    shipmentName: String;
    shipmentType: String;
    shipmentCode: String;
    fromCollection: string;
    toDelivery: string;
    startDate: String;
    endDate: String;
    shipmentImage: String;
    shipmentStatus: String;
}

export class Quotation{
    constructor() {}
    shipmentCode: String;
    transporterId: String;
    amount: String;
    services: [String];
    comment: String;
    status : String;
  }
  