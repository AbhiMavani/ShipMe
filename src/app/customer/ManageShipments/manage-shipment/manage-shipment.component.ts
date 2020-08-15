import { Component, OnInit,ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../services/data.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Router, ActivatedRoute} from '@angular/router';
// import * as $ from 'jquery';
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
  displayedColumns: string[] = ['item', 'collection', 'delivery','date'];
  dataSource: MatTableDataSource<Shipment>;
  filterSelector: String;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  constructor(private _dataService: DataService, private toastr: ToastrService,
    private route: ActivatedRoute, private router: Router) {

        this.filterSelector = "shipmentName";

     }

    ngOnInit() {

      this._dataService.getShipments().subscribe(
        status => {
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
