import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../Class/user';
import { UserService } from './../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account-verified',
  templateUrl: './account-verified.component.html',
  styleUrls: ['./account-verified.component.css']
})
export class AccountVerifiedComponent implements OnInit {

  private token : String;

  constructor(private _userService: UserService, private router: Router, private toastr: ToastrService, private route: ActivatedRoute) { 
    this.route.queryParams.subscribe(params => {this.token = params.token});
  }

  ngOnInit() {
    this._userService.getActivatedAccount({token: this.token}).subscribe(
      res => {
        this.toastr.success('Registration Complete');
        //this.userService.setToken(res['token']);
        //this.router.navigate(['/login']);
      },
      err => {
        if (err.status = 422) {
          this.toastr.error(err.error.join('<br>'));
        } else {
          this.toastr.error('Incorrect Link or Expired Link');
          this.router.navigate(['/home']);
        }
      }
    );
  }

}
