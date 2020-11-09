import { Component, OnInit, ViewChild } from '@angular/core';
import { Quotation } from 'src/app/Class/shipment';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { MapsAPILoader } from '@agm/core';

export interface Location {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-display-shipment',
  templateUrl: './display-shipment.component.html',
  styleUrls: ['./display-shipment.component.css']
})
export class DisplayShipmentComponent implements OnInit {

  private userId;
  private isNotLogin = true;
  private code : string;
  public data;
  private message;
  user_photo: SafeResourceUrl;

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


  displayedColumns: string[] = ['transporter', 'services', 'amount', 'view'];
  quotations: MatTableDataSource<Quotation>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private _dataService: DataService,
     private router: Router,private route: ActivatedRoute,private sanitizer: DomSanitizer,
    private _userService: UserService,private mapsAPILoader: MapsAPILoader) {

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

    if (this._userService.isLoggedIn()){
      this.userId = this._userService.getUserPayload().user_name;
      this.isNotLogin = false;
    }

    this._dataService.getShipment(this.code).subscribe(
      status => {
        this.data = status;
        this.user_photo =  this.sanitizer.bypassSecurityTrustResourceUrl('data:' + this.data.shipmentImage.contentType + ';base64,' + this.arrayBufferToBase64(this.data.shipmentImage.image.data));
        this.data.imgURL = this.user_photo;

        this._dataService.getQuotationByShipment(this.data.shipmentCode).subscribe(

          quotes =>{

              quotes.forEach(element => {
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
    // this.origin = this.data.fromCollection;
    // this.destination = this.data.toDelivery;
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
      var tmp = this.data.fromCollection;
      this._dataService.geocodeAddress(tmp).subscribe((ori:Location) => {
        this.origin = {lat : ori.lat, lng: ori.lng};
      });
      var tmp1 = this.data.toDelivery;
      this._dataService.geocodeAddress(tmp1).subscribe((des:Location) => {
        this.destination = {lat : des.lat, lng: des.lng};
      });
    //  this.setCurrentLocation();
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


  onShipmentSelect() {
    this.router.navigate(['/transporter/shipment/quotation'],{queryParams: {shipmentCode: this.data.shipmentCode , transporterCode: this.userId }});
  }



}
