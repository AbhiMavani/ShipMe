import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Shipment,Quotation } from 'src/app/Class/shipment';
import { MapsAPILoader } from '@agm/core';
import { FormControl, FormGroup } from '@angular/forms';
// import { error } from 'console';

@Component({
  selector: 'app-manage-quotation',
  templateUrl: './manage-quotation.component.html',
  styleUrls: ['./manage-quotation.component.css']
})

export class ManageQuotationComponent implements OnInit {

  dataSource: MatTableDataSource<Quotation>;
  filterSelector: String;
  user_photo: SafeResourceUrl;
  userId;
  isNotLogin;
  abhi: String;
  dataForm = new FormGroup({
    ackReceipt :new FormControl(' '),
  });
  displayedColumns: string[] = ['item', 'amount' , 'edit'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private _dataService: DataService, private toastr: ToastrService,
    private route: ActivatedRoute, private router: Router,private sanitizer: DomSanitizer,
    private _userService: UserService,private mapsAPILoader: MapsAPILoader)
    {
      this.filterSelector = "shipmentName";
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

      this._dataService.getQuotationByUser(this.userId).subscribe(

        quotation => {
          quotation.forEach(element => {
          
              this._dataService.getShipment(element.shipmentCode).subscribe(
                shipment => {
                    this.user_photo =  this.sanitizer.bypassSecurityTrustResourceUrl('data:' + shipment.shipmentImage.contentType + ';base64,' + this.arrayBufferToBase64(shipment.shipmentImage.image.data));
                    element.imgURL = this.user_photo;

                    for(var key of Object.keys(shipment))
                    {
                      element[key] = shipment[key];
                    }
                },
                err => {}
              );
          });



          this.dataSource = new MatTableDataSource<Quotation>(quotation);

          this.dataSource.paginator = this.paginator;
          this.dataSource.filterPredicate = (data: Quotation, filtersJson: string) => {
            const matchFilter = [];
            const filters = JSON.parse(filtersJson);

            filters.forEach(filter => {
              const val = data[filter.id] === null ? '' : data[filter.id];
              matchFilter.push(val.toLowerCase().includes(filter.value.toLowerCase()));
            });
              return matchFilter.every(Boolean);
          };
        },

        err => {}

      );
  }

  setFilter(filterCriteria: string){
    this.filterSelector = filterCriteria;
  }

  applyFilter(filterValue: string) {
    const tableFilters = [];
    tableFilters.push({
      id: this.filterSelector,
      value: filterValue
    });

    this.dataSource.filter = JSON.stringify(tableFilters);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("This is.. " + position.coords.latitude + " "+ position.coords.longitude + " " + position.coords.accuracy);
        // this.lat = position.coords.latitude;
        // this.lng = position.coords.longitude;
        // this.zoom = 15;
      },err => {alert('Please enable your GPS position feature.');},
      {maximumAge:0, timeout:5000, enableHighAccuracy: true});
    }
  }

  onShipmentSelect(data) {
    console.log("Event Creted");
    this.router.navigate(['/transporter/shipment/display', data.shipmentCode]);
  }

  editQuotation(data){
    this.router.navigate(['/transporter/shipment/quotation'],{queryParams: {shipmentCode: data.shipmentCode , transporterCode: this.userId , edit: "True"}});
  }

  deleteQuotation(data){
    this._dataService.deleteQuotation({shipmentCode: data.shipmentCode, transporterId: data.transporterId}).subscribe(
      status => {
        this.toastr.success('Quotation Deleted successfuly');
      },
      error => {
        this.toastr.error("Error while deleting");
      }
    );
    window.location.reload();
  }

  startLiveLocation(data){
    this.setCurrentLocation();

    this.router.navigate(['/livetracking'],{queryParams: {shipmentCode: data.shipmentCode , transporterId: this.userId }});

  }

  finishQuotation(data){
    console.log("******************************");
    
    this._dataService.finishQuotation(data).subscribe();
    window.location.reload();
  }

  // onFileSelect(event,data) {
  //   if (event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     //console.log(data);
  //     this.dataForm.get('ackReceipt').setValue(file);
  //     const formData = new FormData();
  //     formData.append('file', this.dataForm.get('ackReceipt').value);
  //     formData.append('user_name',data.user_name);
  //     formData.append('shipmentCode',data.shipmentCode);
  //     this._dataService.uploadReceipt(formData).subscribe(
  //       res => {
  //         this.toastr.info(res.message);
  //         location.reload();
  //       },
  //       err => {
  //         this.toastr.error(err);
  //         location.reload();
  //       }
  //     );
  //   }
  // }

   
generateInvoice(data){
  console.log(data);
  var serv = '';
  data.services.forEach(element => {
    serv+=element+"-";
  });
  console.log(data.shipmentName);
  var combinedData = {
    amount : data.amount,
    budget: data.budget,
    fromCollection: data.fromCollection,
    shipmentCode : data.shipmentCode,
    services: serv,
    shipmentName: data.shipmentName,
    shipmentType: data.shipmentType,
    startDate: data.startDate,
    status: data.status,
    toDelivery: data.toDelivery,
    transporterId: data.transporterId,
    user_name: data.user_name,
    comment: data.comment,
  }

  this.router.navigate(['/transporter/invoice'],{queryParams: combinedData});
}



}
