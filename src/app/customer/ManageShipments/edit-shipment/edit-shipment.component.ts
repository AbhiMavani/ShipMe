import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormControl,Validators,AbstractControl, FormBuilder  } from '@angular/forms';
import { element } from 'protractor';

@Component({
  selector: 'app-edit-shipment',
  templateUrl: './edit-shipment.component.html',
  styleUrls: ['./edit-shipment.component.css']
})
export class EditShipmentComponent implements OnInit {

  dataForm : FormGroup;
  data:any;
  private budget : String;
  private startDate : String;
  private fromCollection : String;
  private shipmentCode : String;
  isAccepted = true;
  formattedaddress=" ";
  formattedaddress1=" ";
  myDate = new Date();
  currentDate = this.myDate.getFullYear() + '-' + ('0' + (this.myDate.getMonth() + 1)).slice(-2) +
               '-' + ('0' + this.myDate.getDate()).slice(-2);

  constructor(private _dataService: DataService,
    private router: Router,private route: ActivatedRoute,private sanitizer: DomSanitizer,
   private _userService: UserService,private toastr: ToastrService,private _formbuilder: FormBuilder)  {
    
    this.shipmentCode = this.route.snapshot.paramMap.get('id');

    this.dataForm = new FormGroup({
      shipmentCode:  new FormControl(' '),
      shipmentName: new FormControl('',Validators.required),
      shipmentType: new FormControl('',Validators.required),
      fromCollection:new FormControl({value:'',disabled:false},Validators.required),
      budget: new FormControl({value:'',disabled:false},Validators.required),
      toDelivery:new FormControl('',Validators.required),
      startDate:new FormControl({value:'',disabled:false},Validators.required),
      endDate:new FormControl('',Validators.required),
    })
   }

   

  ngOnInit() {
    this.dataForm.get('shipmentCode').setValue(this.route.snapshot.paramMap.get('id'));
    this._dataService.getShipmentForEdit({shipmentCode : this.shipmentCode}).subscribe(
      status => {
        this.data = status;
        console.log(status);
        this.budget = this.dataForm.get('budget').value;
        this.fromCollection = status.fromCollection;
        this.startDate = status.startDate;
        this.dataForm.get('shipmentName').setValue(status.shipmentName);
        this.dataForm.get('shipmentType').setValue(status.shipmentType);
        this.dataForm.get('budget').setValue(status.budget);
        this.dataForm.get('fromCollection').setValue(status.fromCollection);
        this.dataForm.get('toDelivery').setValue(status.toDelivery);
        this.dataForm.get('startDate').setValue(status.startDate);
        this.dataForm.get('endDate').setValue(status.endDate);


      },

      err=>{

      }
    );
  }
  onShipmentSelect(shipment) {
    console.log("Event Creted");
    console.log(shipment);
    this.router.navigate(['/customer/shipment/edit', shipment.shipmentCode]);
  }
  public AddressChange(address: any) { 
    //setting address from API to local variable 
    this.formattedaddress=address.formatted_address;
    this.dataForm.get('fromCollection').setValue(this.formattedaddress);
  }
  public AddressChange1(address: any) { 
    //setting address from API to local variable 
    this.formattedaddress1=address.formatted_address;
    this.dataForm.get('toDelivery').setValue(this.formattedaddress1);
  }

  onUpdate(){
    this.dataForm.get('shipmentName').setValue(this.dataForm.get('shipmentName').value);
    this.dataForm.get('shipmentType').setValue(this.dataForm.get('shipmentType').value);
    this.dataForm.get('fromCollection').setValue(this.dataForm.get('fromCollection').value);
    this.dataForm.get('budget').setValue(this.budget);
    this.dataForm.get('toDelivery').setValue(this.dataForm.get('toDelivery').value);
    this.dataForm.get('endDate').setValue(this.dataForm.get('endDate').value);
    this.dataForm.get('startDate').setValue(this.dataForm.get('startDate').value);
    console.log("#########################################################" + this.budget);
  
  this._dataService.editShipment(this.dataForm.value).subscribe(
    status => {
      this.toastr.success('Shipment Edited successfuly');
      this.router.navigate( [ '/customer/shipment'] );
    },
    error => {
      this.toastr.error(error.error[0]);
    }
  );
  console.log("onupdate");
  }
}
