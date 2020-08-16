import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../services/data.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Router, ActivatedRoute} from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as $ from 'jquery';
import { Shipment } from 'src/app/Class/shipment';

export interface PeriodicElement {
  shipmentName: string;
  shipmentType: number;
  weight: number;
  symbol: string;
}


@Component({
  selector: 'app-manage-shipment',
  templateUrl: './manage-shipment.component.html',
  styleUrls: ['./manage-shipment.component.css']
})
export class ManageShipmentComponent implements OnInit {
  public data;
  dataSource: MatTableDataSource<Shipment>;
  filterSelector: String;
  user_photo: SafeResourceUrl;
  abhi: String;
  displayedColumns: string[] = ['item', 'collection', 'delivery', 'date'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private _dataService: DataService, private toastr: ToastrService,
    private route: ActivatedRoute, private router: Router,private sanitizer: DomSanitizer) {
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
        this._dataService.getShipments().subscribe(
        status => {
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
      console.log(shipment);
      // this.router.navigate(['/customer/shipment', shipment.shipment_name]);
    }


}
