import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
// import * as jsPDF from 'jspdf'

@Component({
  selector: 'app-manage-driver',
  templateUrl: './manage-driver.component.html',
  styleUrls: ['./manage-driver.component.css']
})
export class ManageDriverComponent implements OnInit {

  private userId;
  private isNotLogin;
  public driverList;

  public editFlag : boolean = false;


  public name: string = "";
  public liscence: string = "";
  public phoneNo : string = "";

  constructor(private _dataService: DataService, private toastr: ToastrService,
    private route: ActivatedRoute, private router: Router,private sanitizer: DomSanitizer,
    private _userService: UserService) { }


  ngOnInit() {
    if (this._userService.isLoggedIn()){
      this.userId = this._userService.getUserPayload().user_name;
      this.isNotLogin = false;
    }

    this._dataService.getDrivers({user_name : this.userId}).subscribe(
      data => {
        this.driverList = data;
      },

      error => {
        console.log(error);
      }
    );


  }

  addDriver(){
    if(this.editFlag)
    {
      this.editFlag = false;
      this.driverList.forEach(element => {
        if(element.name == this.name){ element.phoneNo = this.phoneNo;}
      });
      this.name = "";
      this.liscence = "";
      this.phoneNo = "";
    }
    else
    {
      if(this.name && this.liscence){
        var updateData = {user_name: this.userId , name : this.name, liscence : this.liscence, phoneNo : this.phoneNo}
        this._dataService.addDrivers(updateData).subscribe(
          status => {
            this.toastr.success("Driver Added successfully.");
            this.driverList = status;

            this.name = "";
            this.liscence = "";
            this.phoneNo = "";
          },

          error =>{
            console.log(error);
            this.toastr.error(error.error[0]);
          }
        );
      }
      else{
        this.toastr.error("Please enter all the details");
      }
    }

  }



  deleteDriver(driver){
    driver['user_name'] = this.userId;
    this._dataService.deleteDriver(driver).subscribe(
      status=>{
        this.toastr.success("Driver deleted Successfull");
        this.driverList = this.driverList.filter( data => data.liscence != driver.liscence );
      },
      error => {
        console.log(error);
      }
    );

  }

  editDriver(driver) {

    this.editFlag = true;
    this.name= driver.name;
    this.liscence = driver.liscence;
    this.phoneNo = driver.phoneNo;
    console.log("Event: " + driver.name);
  }

}