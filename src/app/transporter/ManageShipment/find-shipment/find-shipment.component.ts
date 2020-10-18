import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Shipment } from 'src/app/Class/shipment';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-find-shipment',
  templateUrl: './find-shipment.component.html',
  styleUrls: ['./find-shipment.component.css']
})
export class FindShipmentComponent implements OnInit {

  public data;
  dataSource: MatTableDataSource<Shipment>;
  filterSelector: String;
  user_photo: SafeResourceUrl;
  userId;
  isNotLogin;
  abhi: String;
  displayedColumns: string[] = ['item', 'collection', 'delivery', 'date'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private _dataService: DataService, private toastr: ToastrService,
    private route: ActivatedRoute, private router: Router,private sanitizer: DomSanitizer,
    private _userService: UserService) { }

  arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }


  ngOnInit(){

    if (this._userService.isLoggedIn()){
      this.userId = this._userService.getUserPayload().user_name;
      this.isNotLogin = false;
    }

    this._dataService.getShipments().subscribe(
      status => {
        console.log(status);
        this.data = status;
        this.dataSource =new MatTableDataSource<Shipment>(status);
        this.dataSource.paginator = this.paginator;;
        this.data.forEach(element => {
          this.user_photo =  this.sanitizer.bypassSecurityTrustResourceUrl('data:' + element.shipmentImage.contentType + ';base64,' + this.arrayBufferToBase64(element.shipmentImage.image.data));
          element.imgURL = this.user_photo;
        });
        this.dataSource = new MatTableDataSource<Shipment>(status);
        this.dataSource.paginator = this.paginator;

        this.dataSource.filterPredicate = (data: Shipment, filtersJson: string) => {
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
    console.log(this.dataSource);
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

  onShipmentSelect(shipment) {
    console.log("Event Creted");
    this.router.navigate(['/transporter/shipment/display', shipment.shipmentCode]);
  }
}
