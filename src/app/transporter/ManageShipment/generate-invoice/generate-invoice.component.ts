import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import pdfMake  from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
 
@Component({
  selector: 'app-generate-invoice',
  templateUrl: './generate-invoice.component.html',
  styleUrls: ['./generate-invoice.component.css']
})
export class GenerateInvoiceComponent implements OnInit {
 
  public shipmentCode;
  public amount;
  public fromCollection;
  public services;
  public shipmentName;
  public shipmentType;
  public toDelivery;
  public transporterId;
  public user_name;
 
  public startDate;
  public endDate;
  public vehicalNo;
  public driverName;
  public liscence;
  public phoneNo;
 
 
  public myDate;
  public currentDate;
 
 
  constructor(private _dataService: DataService, private toastr: ToastrService,
    private route: ActivatedRoute, private router: Router,private sanitizer: DomSanitizer,
    private _userService: UserService) {
 
      this.shipmentCode = this.route.snapshot.queryParamMap.get('shipmentCode');
      this.amount = this.route.snapshot.queryParamMap.get('amount');
      this.fromCollection = this.route.snapshot.queryParamMap.get('fromCollection');
      this.services = this.route.snapshot.queryParamMap.get('services');
      this.shipmentName = this.route.snapshot.queryParamMap.get('shipmentName');
      this.shipmentType = this.route.snapshot.queryParamMap.get('shipmentType');
      this.toDelivery = this.route.snapshot.queryParamMap.get('toDelivery');
      this.transporterId = this.route.snapshot.queryParamMap.get('transporterId');
      this.user_name = this.route.snapshot.queryParamMap.get('user_name');
 
 
      this.myDate = new Date();
      this.currentDate = this.myDate.getFullYear() + '-' + ('0' + (this.myDate.getMonth() + 1)).slice(-2) +
                '-' + ('0' + this.myDate.getDate()).slice(-2);

                
  }
 
  private userId;
  private isNotLogin;
  public driverList;
 
 
  ngOnInit() {
    if (this._userService.isLoggedIn()){
      this.userId = this._userService.getUserPayload().user_name;
      this.isNotLogin = false;
    }
 
    this._dataService.getDrivers({user_name : this.userId}).subscribe(
      data => {
        this.driverList = data;
      },
 
      error => {
        console.log(error);
      }
    );
 
  }
 
  driverSelection(driverName){
    this.driverName = driverName;
    var driver = this.driverList.filter(driver => driver.name == this.driverName)[0];
    if(driver){
      this.liscence = driver.liscence;
      this.phoneNo = driver.phoneNo;
    }
    else{
      this.liscence = "";
      this.phoneNo = "";
    }
  }
 
  download(){
 
    var url = "http://localhost:4200/livetracking?shipmentCode="+this.shipmentCode+"&transporterId="+this.transporterId;
 
    if( (this.driverName && this.startDate && this.endDate && this.vehicalNo) ){
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      const def = { content: 'A sample PDF document generated using Angular and PDFMake' };
 
      var docDefinition = {
 
        header: {text: "ShipMe Invoice" , fontSize : 30 , bold: true,alignment : 'center'},
 
        content: [
          {
            layout: 'lightHorizontalLines', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              // widths: [ '*', 'auto', 100, '*' ],
              widths: ['*','*'],
 
              body: [
                ['',''],
                [ {text: 'Customer Name', bold: true}, this.user_name ],
                [ {text: 'Transporter Name', bold: true}, this.transporterId ],
                [ {text: 'Shipment Name', bold: true}, this.shipmentName ],
                [ {text: 'Shipment Type', bold: true}, this.shipmentType ],
                [ {text: 'Pick Up Location', bold: true}, this.fromCollection ],
                [ {text: 'Delivery Location', bold: true}, this.toDelivery ],
                [ {text: 'Services', bold: true}, this.services ],
                [ {text: 'Shipment Code', bold: true}, this.shipmentCode ],
                [ {text: 'Collection Date', bold: true}, this.startDate ],
                [ {text: 'Estimated Delivery', bold: true}, this.endDate ],
                [ {text: 'Driver Name', bold: true}, this.driverName ],
                [ {text: 'Liscence No', bold: true}, this.liscence ],
                [ {text: 'Phone No', bold: true}, this.phoneNo ],
                [ {text: 'Vehical No', bold: true}, this.vehicalNo ],
                [ {text: 'Payable Amount', bold: true,lineHeight : 2}, {text: this.amount, bold: true}]
 
              ]
            }
          },
          {
            columns: [
              { text: 'Customer Sign', alignment: 'left' },
              { text: 'Transporter Sign', alignment: 'center' },
              { text: 'Receiver Sign', alignment: 'right' },
 
            ],
            margin : [0,40]
          },
          { text: '(Transporter Copy)', lineHeight: 10,pageBreak:'after' },
 
          {
            layout: 'lightHorizontalLines', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              // widths: [ '*', 'auto', 100, '*' ],
              widths: ['*','*'],
 
              body: [
                ['',''],
                [ {text: 'Customer Name', bold: true}, this.user_name ],
                [ {text: 'Transporter Name', bold: true}, this.transporterId ],
                [ {text: 'Shipment Name', bold: true}, this.shipmentName ],
                [ {text: 'Shipment Type', bold: true}, this.shipmentType ],
                [ {text: 'Pick Up Location', bold: true}, this.fromCollection ],
                [ {text: 'Delivery Location', bold: true}, this.toDelivery ],
                [ {text: 'Services', bold: true}, this.services ],
                [ {text: 'Shipment Code', bold: true}, this.shipmentCode ],
                [ {text: 'Collection Date', bold: true}, this.startDate ],
                [ {text: 'Etimated Delivery', bold: true}, this.endDate ],
                [ {text: 'Driver Name', bold: true}, this.driverName ],
                [ {text: 'Liscence No', bold: true}, this.liscence ],
                [ {text: 'Phone No', bold: true}, this.phoneNo ],
                [ {text: 'Vehical No', bold: true}, this.vehicalNo ],
                [ {text: 'Payable Amount', bold: true,lineHeight : 2}, {text: this.amount, bold: true}]
 
              ]
            }
          },
          {
            columns: [
              { text: 'Transporter Sign', alignment: 'left' },
            ],
            margin : [0,40]
          },
          { text: '(Customer Copy)', lineHeight: 10 },
          { qr: url, fit: '100'},
          { text: "scan to track" }
 
 
        ]
      };
 
      pdfMake.createPdf(docDefinition).download();
    }
    else{
      this.toastr.error("Please fill all the values")
    }
 
 
  }
 
}
 

