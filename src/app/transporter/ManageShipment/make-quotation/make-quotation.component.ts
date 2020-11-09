import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';
import { FormGroup, FormControl,Validators,AbstractControl, FormArray, FormBuilder  } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';

@Component({
  selector: 'app-make-quotation',
  templateUrl: './make-quotation.component.html',
  styleUrls: ['./make-quotation.component.css'],

})
export class MakeQuotationComponent implements OnInit {

  dataForm : FormGroup;

  // dataForm = new FormGroup({
  //   shipmentCode : new FormControl(''),
  //   transporterId: new FormControl(''),
  //   amount: new FormControl(''),
  //   services: new FormControl(''),
  //   comment: new FormControl(''),
  //   status: new FormControl('')
  // });

  private shipmentCode : String;
  private transporterCode : String;
  private editBoolean : String;
  private services: String;
  public serviceControl;

  public isPackaging = false;
  public isPickup = false;
  public isLoading = false;
  public isOther = false;
  // For form Control
  marked = false;
  theCheckbox = false;


  constructor(private _dataService: DataService,
    private router: Router,private route: ActivatedRoute,private sanitizer: DomSanitizer,
   private _userService: UserService,private toastr: ToastrService,private _formbuilder: FormBuilder) {
      this.shipmentCode = this.route.snapshot.queryParamMap.get('shipmentCode');
      this.transporterCode = this.route.snapshot.queryParamMap.get('transporterCode');
      this.editBoolean = this.route.snapshot.queryParamMap.get('edit');


      this.dataForm = this._formbuilder.group({
        shipmentCode : '',
        transporterId: '',
        amount: '',
        services: this._formbuilder.array([]),
        comment: '',
        status: ''
      })

      this.serviceControl = this.dataForm.get('services') as FormArray;
  }

  ngOnInit() {

    if(this.editBoolean)
    {
      this._dataService.getQuotationForEdit({shipmentCode : this.shipmentCode , transporterId : this.transporterCode}).subscribe(
        status => {
          this.dataForm.get('amount').setValue(status.amount);
          this.dataForm.get('comment').setValue(status.comment);


          status.services.forEach(element => {
              if(element == "packaging") this.isPackaging=true;
              else if(element == "loading") this.isLoading = true;
              else if(element == "pickup") this.isPickup = true;
              else
              {
                this.isOther = true;
              }

          });

        },

        err=>{

        }
      );
    }


  }

  onSubmit(){

    if(document.getElementById("isOtherChecked").getAttribute("ng-reflect-name") == "true" && document.getElementById("other").getAttribute("ng-reflect-name").length != 0)
    {
      this.serviceControl.push(new FormControl(document.getElementById("other").getAttribute("ng-reflect-name")));
    }

    this.dataForm.get('shipmentCode').setValue(this.shipmentCode);
    this.dataForm.get('transporterId').setValue(this.transporterCode);
    this.dataForm.get('status').setValue('pending');



    if(this.editBoolean){
        this._dataService.editQuotation(this.dataForm.value).subscribe(
          status => {
            this.toastr.success('Quotation Edited successfuly');
            this.router.navigate( [ '/home'] );
          },
          error => {
            this.toastr.error(error.error[0]);
          }
        );
    }
    else{
      this._dataService.postQuotation(this.dataForm.value).subscribe(
        status => {
          this.toastr.success('Quotation Added successfuly');
          this.router.navigate( [ '/home'] );
        },
        error => {
          this.toastr.error(error.error[0]);
        }
      );
    }




  }

  addService(e)
  {
    if(e.target.checked)
    {

      this.serviceControl.push(new FormControl(e.target.getAttribute("name")));
    }
    else
    {
      this.serviceControl.removeAt(this.serviceControl.value.findIndex(element => element=e.target.getAttribute("name")));
    }
  }
}

