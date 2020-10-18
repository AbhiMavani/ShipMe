import { Component, OnInit, ViewChild } from '@angular/core';
import { Quotation } from 'src/app/Class/shipment';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';



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


  displayedColumns: string[] = ['transporter', 'services', 'amount', 'view'];
  quotations: MatTableDataSource<Quotation>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private _dataService: DataService,
     private router: Router,private route: ActivatedRoute,private sanitizer: DomSanitizer,
    private _userService: UserService) {

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
                      // console.log(service);
                      element.stringServices+= " " + service + " ,";
                  });
                  element.stringServices = element.stringServices.slice(0, -1);
              });


              console.log(quotes);
              this.quotations = new MatTableDataSource<Quotation>(quotes);
          },
          error => {}
        );


        console.log(this.data);
      },
      err => {}
    );
  }


  onShipmentSelect() {
    this.router.navigate(['/transporter/shipment/quotation'],{queryParams: {shipmentCode: this.data.shipmentCode , transporterCode: this.userId }});
  }



}
