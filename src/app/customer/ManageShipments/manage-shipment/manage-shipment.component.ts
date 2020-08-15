import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../services/data.service';
import { Router, ActivatedRoute} from '@angular/router';
import * as $ from 'jquery';

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
  dataSource;
  displayedColumns: string[] = ['item', 'collection', 'delivery', 'date'];
  constructor(private _dataService: DataService, private toastr: ToastrService,
    private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
      this._dataService.getShipments().subscribe(
        status => {
          this.data = status;
          this.dataSource =this.data;
          console.log(this.data);
        },
        err => {}
      );
  
    }
    onShipmentSelect(shipment) {
      console.log("Event Creted");
      console.log(this.router);
      this.router.navigate(['/customer/shipment', shipment.shipment_name]);
    }


}
