import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import * as $ from 'jquery';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    user=true;
    userTransporter=true;
    admin;
    login;
    notLogin;
    first_name = '';
    last_name = '';
    userDetails = '';
    userPayload;
    constructor(private userService: UserService, private router: Router) { }


    // Display login , signup or name of user if login.
    ngOnInit() {
        $(document).ready( () => {
            let x;
            if ( location.pathname.split('/')[1] !== 'home') {
                $('.nav li').removeClass('active');
            }
            if ( location.pathname.split('/')[1] === 'admin') {
                x = '.' + location.pathname.split('/')[2];
            } else {
                x = '.' + location.pathname.split('/')[1];
            }
            $(x).addClass('active');
        });

        if (this.userService.isAdminLoggedIn()) {
            this.login = true;
            this.notLogin = false;
            this.user = false;
            this.userTransporter = false;
            this.admin = true;
            this.userService.getUserProfile().subscribe(
                res => {
                    this.userDetails = res['user'];
                    this.first_name = this.userDetails['first_name'];
                    this.last_name = this.userDetails['last_name'];
                }
            );
        } else if (this.userPayload = this.userService.isLoggedIn()) {
            if(this.userPayload.userType === 'Customer'){
                this.login = true;
                this.notLogin = false;
                this.user = true;
                this.admin = false;
                this.userTransporter = false;
            } else if(this.userPayload.userType === 'Transporter'){
                    this.login = true;
                    this.notLogin = false;
                    this.user = false;
                    this.admin = false;
                    this.userTransporter = true;
            }
            this.userService.getUserProfile().subscribe(
                res => {
                    this.userDetails = res['user'];
                    this.first_name = this.userDetails['first_name'];
                    this.last_name = this.userDetails['last_name'];
                }
            );
        } else if (this.userService.isTransporterLoggedIn()) {
            this.login = true;
            this.notLogin = false;
            this.userTransporter = true;
            this.admin = false;
            this.user = false;
            this.userService.getUserProfile().subscribe(
                res => {
                    this.userDetails = res['user'];
                    this.first_name = this.userDetails['first_name'];
                    this.last_name = this.userDetails['last_name'];
                }
            );
        } else {
            this.login = false;
            this.notLogin = true;
            this.user = true;
            this.userTransporter = true;
            this.admin = false;
        }
    }

    // for logout button in name part of header
    onLogout() {
        this.userService.deleteToken();
        this.router.navigate(['/login']);
    }

}
