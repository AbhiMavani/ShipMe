import { Component, OnInit,HostListener,Directive  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../services/data.service';
import {  FileUploader } from 'ng2-file-upload';
import * as $ from 'jquery';

export interface Tile {
  id: number,
  name: string,
  path:  string
}

const uploadAPI = 'http://localhost:3000/api/upload';

@Component({
  selector: 'app-create-shipment',
  templateUrl: './create-shipment.component.html',
  styleUrls: ['./create-shipment.component.css']
})
@Directive({selector: 'img[changeColor]'})
export class CreateShipmentComponent implements OnInit {

  public shipmentCode: any;
  public shipmentName: any;
  public shipmentType: any;
  public fromCollection: any;
  public toDelivery: any;
  public shipmentImage: File;
  public startDate: any;
  public endDate: any;
  data;
  defFile;
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
      private route: ActivatedRoute, private router: Router) {
  
    }

    public uploader: FileUploader = new FileUploader({ url: uploadAPI, itemAlias: 'file' });

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('FileUpload:uploaded successfully:', item.file.name);
         alert('Your file has been uploaded successfully');
    };
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
    this.shipmentType = this.tiles[id].name;
  }
  

  onSubmit() {
    this.shipmentCode = 'ABC';
    if (this.defFile === '') {
      if (this.defFile === '') {
        this.toastr.error('Please upload Shipment Image');
      }
    } else {
      this.data = {
        shipmentCode:  this.shipmentCode,
        shipmentName: this.shipmentName,
        shipmentType: this.shipmentType,
        fromCollection: this.fromCollection,
        toDelivery: this.toDelivery,
        startDate: this.startDate,
        endDate: this.endDate,
      };

      console.log(this.data);

      this._dataService.postShipment(this.data).subscribe(
        status => {
          this.toastr.success('Shipment Added successfuly');
          this.router.navigate( [ '/home'] );
        },
        error => {
          this.toastr.error(error.error[0]);
        }
      );
    }
  }

  imageUpload(event) {
    let fileList: FileList = event.target.files;
    const file: File = fileList[0];
    console.log(file);
    var reader = new FileReader();
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    var base64result = reader.result;
    this.shipmentImage= base64result;
  }
}

