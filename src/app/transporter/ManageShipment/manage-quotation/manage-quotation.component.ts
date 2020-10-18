import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Shipment,Quotation } from 'src/app/Class/shipment';

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
  displayedColumns: string[] = ['item', 'amount' , 'edit'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private _dataService: DataService, private toastr: ToastrService,
    private route: ActivatedRoute, private router: Router,private sanitizer: DomSanitizer,
    private _userService: UserService)
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

      this._dataService.getQuotation().subscribe(

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

  onShipmentSelect(data) {
    console.log("Event Creted");
    this.router.navigate(['/customer/shipment', data.shipmentCode]);
  }

  editQuotation(data){
    this.router.navigate(['/transporter/shipment/quotation'],{queryParams: {shipmentCode: data.shipmentCode , transporterCode: this.userId , edit: "True"}});
  }
}
