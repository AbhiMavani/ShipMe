import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader} from '@agm/core';
import { DataService } from '../../../services/data.service';
import { UserService } from '../../../services/user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AgmDirectionModule } from 'agm-direction';
import {HttpClient} from '@angular/common/http';
import { Quotation, Shipment } from 'src/app/Class/shipment';
import { Router, ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from './Location';
import { stringify } from 'querystring';
import { MatTableDataSource } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

declare global {
    interface Window { StripeCheckout: any; }
}

@Component({
  selector: 'app-view-shipment',
  templateUrl: './view-shipment.component.html',
  styleUrls: ['./view-shipment.component.css']
})
export class ViewShipmentComponent implements OnInit {

  private userId;
  private userType;
  private isNotLogin = true;
  private code : string;
  data : any;
  pdfData: any;
  user_photo: SafeResourceUrl;

  handler:any = null;

  lat: number;
  lng: number;
  zoom:number;
  address: string;
  private geoCoder;
  tmp:any;
  tmp1:any;
  public ori : Location;
  public origin: any;
  public destination: any;

  public isAccepted=false;
  public acceptedTransporter="";

  displayedColumns: string[] = ['transporter', 'services', 'amount', 'accept'];
  quotations: MatTableDataSource<Quotation>;
  public isCompleted = false;
  user_pdf: any;

  constructor(private _dataService: DataService,
     private router: Router,private route: ActivatedRoute,private sanitizer: DomSanitizer,
    private _userService: UserService,private toastr: ToastrService,private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {

        this.code = this.route.snapshot.paramMap.get('id');

    }

    arrayBufferToBase64(buffer) {
      let binary = '';
      let bytes = new Uint8Array(buffer);
      let len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    }

  ngOnInit() {
    this.data = null;
    if (this._userService.isLoggedIn()){
      this.userId = this._userService.getUserPayload().user_name;
      this.isNotLogin = false;
      this.userType = this._userService.getUserPayload().userType;
    }

    this._dataService.getShipment(this.code).subscribe(
      status => {
        this.data = status;
        this.user_photo =  this.sanitizer.bypassSecurityTrustResourceUrl('data:' + this.data.shipmentImage.contentType + ';base64,' + this.arrayBufferToBase64(this.data.shipmentImage.image.data));
        this.data.imgURL = this.user_photo;

        this._dataService.getQuotationByShipment(this.data.shipmentCode).subscribe(

          quotes =>{
              quotes.forEach(element => {

                  if(element.status=="accepted"){
                    this.isAccepted = true;
                    this.acceptedTransporter = element.transporterId;
                  }else if(element.status=="completed"){
                    this.isCompleted = true;
                    this.isAccepted = false;
                    this.acceptedTransporter = element.transporterId;
                  }
                  
                  element.stringServices = ' ';
                  element.services.forEach(service => {
                      
                      element.stringServices+= " " + service + " ,";
                  });
                  element.stringServices = element.stringServices.slice(0, -1);
              });

              
              this.quotations = new MatTableDataSource<Quotation>(quotes);
          },
          error => {}
        );

        this.after1();
      },
      err => {}
    );


  }
  after1() {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
      console.log("here ....com " + this.data.fromCollection);
      var tmp = this.data.fromCollection;
      this._dataService.geocodeAddress(tmp).subscribe((ori:Location) => {
        this.origin = {lat : ori.lat, lng: ori.lng};
      });
      var tmp1 = this.data.toDelivery;
      this._dataService.geocodeAddress(tmp1).subscribe((des:Location) => {
        this.destination = {lat : des.lat, lng: des.lng};
      });
     this.setCurrentLocation();
    });
  }



  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 15;
      },err => {alert('Please enable your GPS position feature.');},
      {maximumAge:0, timeout:5000, enableHighAccuracy: true});
    }
  }


  onShipmentSelect(data){
    this._userService.sendNotification({shipmentCode: data.shipmentCode, transporterId: data.transporterId}).subscribe();
    this._dataService.acceptQuotation({shipmentCode: data.shipmentCode, transporterId: data.transporterId}).subscribe(
      status=>{
        this.toastr.success(status["message"]);

      },
      error=>{
        this.toastr.error(error.error[0]);
      }
    );
    window.location.reload();

  }
      
  editShipment(shipment){
    this.router.navigate(['/customer/shipment/edit', shipment.shipmentCode]);
  }

  deleteShipment(data){
      this._dataService.deleteShipment({shipmentCode: data.shipmentCode}).subscribe(
        status => {
          this.router.navigate(['customer/shipment']);
          this.toastr.success('Shipment Deleted successfuly');
        },
        error => {
          this.toastr.error("Error while deleting");
        }
      );
      //window.location.reload();
  }

  showReceipt(data) {
    this._dataService.getReceipt(data.shipmentCode).subscribe(
      status => {
        this.pdfData = status;
        this.user_pdf =  this.sanitizer.bypassSecurityTrustResourceUrl('data:' + this.pdfData.ackReceipt.contentType + ';base64,' + this.arrayBufferToBase64(this.pdfData.ackReceipt.receiptPDF.data));
        var dataURI = "data:application/pdf;base64," +this.arrayBufferToBase64(this.pdfData.ackReceipt.receiptPDF.data);
        var win = window.open();
        win.document.write('<iframe src="' + dataURI  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
      },
      err => {
        this.toastr.error("Unable to load Invoice file.");
      }
    );
  }

  // pay(amount) {   

  //   var handler = (window).StripeCheckout.configure({
  //     key: 'pk_test_aeUUjYYcx4XNfKVW60pmHTtI',
  //     locale: 'auto',
  //     token: function (token: any) {
  //       // You can access the token ID with `token.id`.
  //       // Get the token ID to your server-side code for use.
  //       console.log(token)
  //       alert('Token Created!!');
  //     }
  //   });

  //   handler.open({
  //     name: 'Demo Site',
  //     description: '2 widgets',
  //     amount: amount * 100
  //   });

  // }


  // loadStripe() {

  //   if(!window.document.getElementById('stripe-script')) {
  //     var s = window.document.createElement("script");
  //     s.id = "stripe-script";
  //     s.type = "text/javascript";
  //     s.src = "https://checkout.stripe.com/checkout.js";
  //     s.onload = () => {
  //       this.handler = (window).StripeCheckout.configure({
  //         key: 'pk_test_aeUUjYYcx4XNfKVW60pmHTtI',
  //         locale: 'auto',
  //         token: function (token: any) {
  //           // You can access the token ID with `token.id`.
  //           // Get the token ID to your server-side code for use.
  //           console.log(token)
  //           alert('Payment Success!!');
  //         }
  //       });
  //     }

  //     window.document.body.appendChild(s);
  //   }
  // }


}
