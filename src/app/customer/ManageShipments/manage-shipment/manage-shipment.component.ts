import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../services/data.service';
import { Router, ActivatedRoute} from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  user_photo: SafeResourceUrl;
  abhi: String;
  displayedColumns: string[] = ['item', 'collection', 'delivery', 'date'];
  constructor(private _dataService: DataService, private toastr: ToastrService,
    private route: ActivatedRoute, private router: Router,private sanitizer: DomSanitizer) { }

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
          this.dataSource =this.data;
          this.data.forEach(element => {
            this.user_photo =  this.sanitizer.bypassSecurityTrustResourceUrl('data:' + element.shipmentImage.contentType + ';base64,' + this.arrayBufferToBase64(element.shipmentImage.image.data));
            element.imgURL = this.user_photo;
          });
          console.log(this.data);
        },
        err => {}
      );
  
    }
    onShipmentSelect(shipment) {
      console.log("Event Creted");
      console.log(this.router);
      this.router.navigate(['/home', shipment.shipmentName]);
    }

    


}
