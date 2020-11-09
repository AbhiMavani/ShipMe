import { MapsAPILoader } from '@agm/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  private shipmentData;
  dataForm = new FormGroup({
    ackReceipt :new FormControl(' '),
  });

  constructor(private _dataService: DataService,
    private router: Router,private route: ActivatedRoute,private sanitizer: DomSanitizer,
   private _userService: UserService,private toastr: ToastrService,private mapsAPILoader: MapsAPILoader) {

    this.shipmentCode = this.route.snapshot.queryParamMap.get('shipmentCode');
    this.transporterId = this.route.snapshot.queryParamMap.get('transporterId');

   

  }

  ngOnInit() {

    if (this._userService.isLoggedIn()){
      this.userId = this._userService.getUserPayload().user_name;
      this.isNotLogin = false;
      this.userType = this._userService.getUserPayload().userType;
      this._dataService.getShipment(this.shipmentCode).subscribe(
        status =>{
          this.shipmentData = status;
          this.mapsAPILoader.load().then(() => {
            this.geoCoder = new google.maps.Geocoder;

            this._dataService.geocodeAddress(this.shipmentData.fromCollection).subscribe((ori:Location) => {

              this.origin = {lat : ori.lat, lng: ori.lng};
            });
            this._dataService.geocodeAddress(this.shipmentData.toDelivery).subscribe((des:Location) => {
              this.destination = {lat : des.lat, lng: des.lng};
            });
           this.setCurrentLocation();
          });
        }
      );
    }

    this.setCurrentLocation();
    this.after1();
  }

  after1() {
    // this.origin = this.data.fromCollection;
    // this.destination = this.data.toDelivery;


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

  finishQuotation(){
    var data = {shipmentCode : this.shipmentCode , transporterId : this.transporterId}
    this._dataService.completeShipment(data).subscribe(
      status => {
        this.toastr.success('Thank you for using the service');
        this.router.navigate( [ '/home'] );
      },

      error=>{
        this.toastr.error('There was some problem in updating the status' + error[0]);
      }
    );
  }

  updateLocation(){

    if(this.userType == "Transporter"){
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

  onFileSelect(event,data) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.dataForm.get('ackReceipt').setValue(file);
      const formData = new FormData();
      formData.append('file', this.dataForm.get('ackReceipt').value);
      formData.append('user_name',data.user_name);
      formData.append('shipmentCode',data.shipmentCode);
      this._dataService.uploadReceipt(formData).subscribe(
        res => {
          this.toastr.info(res.message);
          location.reload();
        },
        err => {
          this.toastr.error(err);
          location.reload();
        }
      );
    }
  }

}