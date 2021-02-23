import { Component, OnInit,HostListener,Directive  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MapsAPILoader} from '@agm/core';
import { FormGroup, FormControl,Validators,AbstractControl  } from '@angular/forms';
import { GooglePlaceModule } from "ngx-google-places-autocomplete"; 
import { DataService } from '../../../services/data.service';
import { UserService } from '../../../services/user.service';
import * as $ from 'jquery';
import { formatDate } from '@angular/common';
import { Location } from '../view-shipment/Location';

export interface Tile {
  id: number,
  name: string,
  path:  string
}


@Component({
  selector: 'app-create-shipment',
  templateUrl: './create-shipment.component.html',
  styleUrls: ['./create-shipment.component.css']
})
@Directive({selector: 'img[changeColor]'})
export class CreateShipmentComponent implements OnInit {

  sCode:String;
  formattedaddress=" ";
  formattedaddress1=" ";
  public ori: Location;
  private geoCoder; 
  dataForm = new FormGroup({
    shipmentCode:  new FormControl(' '),
    shipmentName: new FormControl(' '),
    shipmentType: new FormControl(' '),
    fromCollection:new FormControl(' '),
    budget: new FormControl(''),
    toDelivery:new FormControl(' '),
    shipmentImage:new FormControl(' '),
    startDate:new FormControl(''),
    endDate:new FormControl(' '),
    shipmentStatus:new FormControl(''),
  });
  defFile;
  isNotLogin = true;
  userId;
   changeText: boolean = false
   tiles: Tile[] = [
     {id : 0, name: 'Furnitures & General Items',path: './../../../../assets/images/cat_0.svg'},
     {id : 1, name: 'Boxes',path: './../../../../assets/images/cat_1.svg'},
     {id : 2, name: 'Cars',path: './../../../../assets/images/cat_2.svg'},
     {id : 3, name: 'Motorcycles',path: './../../../../assets/images/cat_3.svg'},
     {id : 4, name: 'Other Vehiclas',path: './../../../../assets/images/cat_4.svg'},
     {id : 5, name: 'Moving Home',path: './../../../../assets/images/cat_5.svg'},
     {id : 6, name: 'Haulage',path: './../../../../assets/images/cat_6.svg'},
     {id : 7, name: 'Boats',path: './../../../../assets/images/cat_7.svg'},
     {id : 8, name: 'Vehicle Parts',path: './../../../../assets/images/cat_8.svg'},
     {id : 9, name: 'Pianos',path: './../../../../assets/images/cat_9.svg'},
     {id : 10, name: 'Pets & Riverstock',path: './../../../../assets/images/cat_10.svg'},
     {id : 11, name: 'Other',path: './../../../../assets/images/cat_11.svg'}, 
   ];

   myDate = new Date();
   currentDate = this.myDate.getFullYear() + '-' + ('0' + (this.myDate.getMonth() + 1)).slice(-2) +
                '-' + ('0' + this.myDate.getDate()).slice(-2);


    constructor(private _dataService: DataService, private toastr: ToastrService,
      private route: ActivatedRoute, private router: Router,private _userService:UserService,private mapsAPILoader: MapsAPILoader) {
  
    }

  ngOnInit() {
    if (this._userService.isLoggedIn()){
      this.userId = this._userService.getUserPayload().user_name;
      this.isNotLogin = false;  
    }
    $(document).on('click', '.browse', function() {
      let file;
      file = $(this).parent().parent().parent().find('.file');
      file.trigger('click');
    });
    $(document).on('change', '#single', function() {
      $(this).parent().find('.form-control').val($(this).val().replace('C:\\fakepath\\', ''));
    });
  }

  changeColor(changeText,ind) {
    if(changeText){
      this.tiles[ind].path = './../../../../assets/images/cat_'+ind+'_hover.svg';
    }
    else{
      this.tiles[ind].path = './../../../../assets/images/cat_'+ind+'.svg';
    }
  }

  closeModal(id) {
    this.dataForm.get('shipmentType').setValue(this.tiles[id].name);
  }

  get dataFormControl() {
    return this.dataForm.controls;
  }
  

  onSubmit() {
    this.sCode = (this.userId.trim().concat(this.dataForm.get('shipmentName').value.trim().slice(0,5).toString())).toUpperCase();
    this.sCode = this.sCode.replace(/\s/g, ""); 
    this.dataForm.get('shipmentCode').setValue(this.sCode);
    const formData = new FormData();  
    if (this.defFile === '') {
      if (this.defFile === '') {
        this.toastr.error('Please upload Shipment Image');
      }
    } else {
      this.dataForm.get('shipmentStatus').setValue('pending');
      formData.append('user_name', this.userId);
        formData.append('file', this.dataForm.get('shipmentImage').value);
        formData.append('shipmentCode',this.dataForm.get('shipmentCode').value);
        formData.append('shipmentName',this.dataForm.get('shipmentName').value);
        formData.append('shipmentType',this.dataForm.get('shipmentType').value);
        formData.append('budget',this.dataForm.get('budget').value);
        formData.append('fromCollection',this.dataForm.get('fromCollection').value);
        formData.append('toDelivery',this.dataForm.get('toDelivery').value);
        formData.append('startDate',this.dataForm.get('startDate').value);
        formData.append('endDate',this.dataForm.get('endDate').value);
        formData.append('shipmentStatus',this.dataForm.get('shipmentStatus').value);
      };
      
      this._dataService.postShipment(formData).subscribe(
        status => {
          this.toastr.success('Shipment Added successfuly');
          this.router.navigate( [ '/home'] );
        },
        error => {
          this.toastr.error(error.error[0]);
        }
      );
    }
    onFileSelect(event) {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.dataForm.get('shipmentImage').setValue(file);
      }
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
  }




