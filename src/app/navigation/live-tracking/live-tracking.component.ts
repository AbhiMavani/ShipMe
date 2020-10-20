import { MapsAPILoader } from '@agm/core';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

export interface Location {
  lat: number;
  lng: number;
}


@Component({
  selector: 'app-live-tracking',
  templateUrl: './live-tracking.component.html',
  styleUrls: ['./live-tracking.component.css']
})



export class LiveTrackingComponent implements OnInit {

  lat: number;
  lng: number;
  zoom:number;
  address: string;
  private geoCoder;

  public ori : Location;
  public origin: any;
  public destination: any;

  private userId;
  private isNotLogin;
  private userType;

  private shipmentCode;
  private transporterId;

  private data;


  constructor(private _dataService: DataService,
    private router: Router,private route: ActivatedRoute,private sanitizer: DomSanitizer,
   private _userService: UserService,private toastr: ToastrService,private mapsAPILoader: MapsAPILoader) {

    this.shipmentCode = this.route.snapshot.queryParamMap.get('shipmentCode');
    this.transporterId = this.route.snapshot.queryParamMap.get('transporterId');

    console.log(this.shipmentCode);
    console.log(this.transporterId);

  }

  ngOnInit() {

    if (this._userService.isLoggedIn()){
      this.userId = this._userService.getUserPayload().user_name;
      this.isNotLogin = false;
      this.userType = this._userService.getUserPayload().userType;
      // console.log(this._userService.getUserPayload());
    }

    this.setCurrentLocation();
    this.after1();
  }

  after1() {
    // this.origin = this.data.fromCollection;
    // this.destination = this.data.toDelivery;
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;

      this._dataService.geocodeAddress('Surat').subscribe((ori:Location) => {
        console.log("Origin.. " + ori.lng);
        this.origin = {lat : ori.lat, lng: ori.lng};
      });
      this._dataService.geocodeAddress('Bharuch').subscribe((des:Location) => {
        console.log("Destination " + des.lat);
        this.destination = {lat : des.lat, lng: des.lng};
      });
     this.setCurrentLocation();
    });
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("This is.. " + position.coords.latitude + " "+ position.coords.longitude + " " + position.coords.accuracy);
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 15;

      },err => {alert('Please enable your GPS position feature.');},
      {maximumAge:0, timeout:5000, enableHighAccuracy: true});
    }
  }

  updateLocation(){

    if(this.userType == "Transporter" && false){
      this.setCurrentLocation();
      this.data = {
        shipmentCode : this.shipmentCode ,
        transporterId : this.transporterId,
        lat : this.lat,
        lng : this.lng
      }

      this._dataService.postLocation(this.data).subscribe();

    }
    else{
      this.data  = {
        shipmentCode : this.shipmentCode,
        transporterId : this.transporterId
      }

      this._dataService.getLocation(this.data).subscribe(
        status =>{
          this.lat = status.lat;
          this.lng = status.lng;
        }
      );
    }





  }

}
