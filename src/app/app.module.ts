 // built-in
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { Routes, RouterModule} from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import {NgxPaginationModule} from 'ngx-pagination';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import {MatTableModule, MatDialogModule, MatGridListModule} from '@angular/material';
import { FileUploadModule } from 'ng2-file-upload';
import { MatPaginatorModule, MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,MatCardModule } from '@angular/material';

// components
import { AppComponent } from './app.component';
import { HeaderComponent } from './base/header/header.component';
import { ContestsComponent } from './contests/contests.component';
import { PracticeComponent } from './practice/practice.component';
import { RegistrationComponent } from './authentication/registration/registration.component';
import { LoginComponent } from './authentication/login/login.component';
import { HomeComponent } from './base/home/home.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { UserProfileComponent } from './profile/user-profile/user-profile.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { MyQuestionComponent } from './profile/my-question/my-question.component';
import { DiscussComponent } from './discuss/discuss.component';
import { AnswerComponent } from './answer/answer.component';
import { ManageContestsComponent } from './admin/ManageContests/manage-contests/manage-contests.component';
import { ManageUserComponent } from './admin/ManageUsers/manage-user/manage-user.component';
import { ManageProblemsComponent } from './admin/ManageProblems/manage-problems/manage-problems.component';
import { CreateProblemsComponent } from './admin/ManageProblems/create-problems/create-problems.component';
import { CreateContestsComponent } from './admin/ManageContests/create-contests/create-contests.component';
import { ViewProblemComponent } from './admin/ManageProblems/view-problem/view-problem.component';
import { ViewContestComponent } from './admin/ManageContests/view-contest/view-contest.component';
import { ForgetPasswordComponent } from './authentication/forget-password/forget-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { CreateShipmentComponent } from './customer/ManageShipments/create-shipment/create-shipment.component';
import { ManageShipmentComponent } from './customer/ManageShipments/manage-shipment/manage-shipment.component';
import { ViewShipmentComponent } from './customer/ManageShipments/view-shipment/view-shipment.component';


// services
import { UserService } from './services/user.service';
import { DiscussService } from './services/discuss.service';
import { DataService } from './services/data.service';

// others
import { AuthGuard } from './auth/auth.guard';
import { AdminAuthGuard } from './auth/authAdmin.guard';
import { TransporterAuthGuard } from './auth/authTransporter.guard';
import { AuthInterceptor } from './auth/auth.interceptor';

// pipes
import { SearchFilterPipe } from './_pipe/search-filter.pipe';
import { HighlightPipe } from './_pipe/highlight.pipe';
import { MyAnswerComponent } from './profile/my-answer/my-answer.component';
import { IdeComponent } from './ide/ide.component';
import { ViewcontestComponent } from './contests/viewcontest/viewcontest.component';
import { ViewContestProblemComponent } from './contests/view-contest-problem/view-contest-problem.component';
import { CompileAndRunComponent } from './ide/compile-and-run/compile-and-run.component';
import { RankingComponent } from './ranking/ranking.component';
import { ViewFileComponent } from './ide/view-file/view-file.component';
import { RegiUserComponent } from './authentication/registration/regi-user/regi-user.component';
import { UploadComponent } from './upload/upload.component';
import { DisplayShipmentComponent } from './transporter/ManageShipment/display-shipment/display-shipment.component';
import { FindShipmentComponent } from './transporter/ManageShipment/find-shipment/find-shipment.component';
import { MakeQuotationComponent } from './transporter/ManageShipment/make-quotation/make-quotation.component';
import { ManageQuotationComponent } from './transporter/ManageShipment/manage-quotation/manage-quotation.component';
import { LiveTrackingComponent } from './navigation/live-tracking/live-tracking.component';
import { EditShipmentComponent } from './customer/ManageShipments/edit-shipment/edit-shipment.component';
import { AccountVerifiedComponent } from './authentication/account-verified/account-verified.component';
import { EmailSentComponent } from './authentication/email-sent/email-sent.component';
import { ManageDriverComponent } from './transporter/ManageShipment/manage-driver/manage-driver.component';
import { GenerateInvoiceComponent } from './transporter/ManageShipment/generate-invoice/generate-invoice.component';






// routes
const routes: Routes = [

  // ide
  { path: 'ide', component: IdeComponent},
  { path: 'contest/:id/submit/:pid', component: CompileAndRunComponent },

  // User  authentication
  { path: 'regiuser', component:RegiUserComponent},
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'activated', component: AccountVerifiedComponent},
  { path: 'activateAccount', component: EmailSentComponent},

  // User Profile
  { path: 'profile', component: ProfileComponent , canActivate: [AuthGuard]},
  { path: 'profile/:userId', component: UserProfileComponent},
  { path: 'forget-password', component: ForgetPasswordComponent},
  { path: 'reset-password', component: ResetPasswordComponent ,  canActivate: [AuthGuard]},
  { path: 'edit-profile', component: EditProfileComponent , canActivate: [AuthGuard]},
  { path: 'my-question', component: MyQuestionComponent , canActivate: [AuthGuard]},
  { path: 'my-answer', component: MyAnswerComponent , canActivate: [AuthGuard]},

  // contests
  { path: 'contests', component: ContestsComponent },
  { path: 'contest/:id', component: ViewcontestComponent },
  { path: 'contest/:id/:pid', component: ViewContestProblemComponent },
  { path: 'rankings/:id', component: RankingComponent },
  { path: 'viewsolution/:username/:solutionID', component: ViewFileComponent },

  //customer
  { path: 'customer/shipment', component: ManageShipmentComponent , canActivate: [AuthGuard]},
  { path: 'customer/shipment/create', component: CreateShipmentComponent , canActivate: [AuthGuard]},
  { path: 'customer/shipment/:id', component: ViewShipmentComponent , canActivate: [AuthGuard]},
  { path: 'customer/shipment/edit/:id', component: EditShipmentComponent , canActivate: [AuthGuard]},

  // Navigation
  { path: 'livetracking', component: LiveTrackingComponent , canActivate: [AuthGuard]},

  //Transporter
  { path: 'transporter/shipment/display/:id', component: DisplayShipmentComponent, canActivate: [AuthGuard] },
  { path: 'transporter/shipment/find', component: FindShipmentComponent, canActivate: [AuthGuard] },
  { path: 'transporter/shipment/quotation', component: MakeQuotationComponent, canActivate: [AuthGuard] },
  { path: 'transporter/shipment/view-quotation', component: ManageQuotationComponent, canActivate: [AuthGuard] },
  { path: 'transporter/drivers', component: ManageDriverComponent, canActivate: [AuthGuard] },
  { path: 'transporter/invoice', component: GenerateInvoiceComponent, canActivate: [AuthGuard] },





  // practice
  { path: 'practice', component: PracticeComponent },
  // Admin Problem
  { path: 'admin/problems', component: ManageProblemsComponent , canActivate: [AdminAuthGuard]},
  { path: 'admin/problem/create', component: CreateProblemsComponent , canActivate: [AdminAuthGuard]},
  { path: 'admin/problem/:id', component: ViewProblemComponent , canActivate: [AdminAuthGuard]},
  // Admin Contests
  { path: 'admin/contests', component: ManageContestsComponent , canActivate: [AdminAuthGuard]},
  { path: 'admin/contest/create', component: CreateContestsComponent , canActivate: [AdminAuthGuard]},
  { path: 'admin/contest/:id', component: ViewContestComponent , canActivate: [AdminAuthGuard]},
  // Admin User
  { path: 'admin/crud', component: ManageUserComponent , canActivate: [AdminAuthGuard]},
  // Discuss
  { path: 'discuss/answer/:id', component: AnswerComponent },
  { path: 'discuss', component: DiscussComponent },
  { path: '**', component: HomeComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContestsComponent,
    PracticeComponent,
    RegistrationComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent,
    UserProfileComponent,
    EditProfileComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    RankingComponent,

    // Admin Problems
    ManageProblemsComponent,
    CreateProblemsComponent,
    ViewProblemComponent,

    // Admin Contests
    ManageContestsComponent,
    CreateContestsComponent,

    // Admin Users
    ManageUserComponent,
    ViewContestComponent,

    DiscussComponent,
    AnswerComponent,
    SearchFilterPipe,
    HighlightPipe,
    MyQuestionComponent,
    MyAnswerComponent,
    IdeComponent,
    ViewcontestComponent,
    ViewContestProblemComponent,
    CompileAndRunComponent,
    ViewFileComponent,
    RegiUserComponent,

    //User Shipment
    CreateShipmentComponent,
    ManageShipmentComponent,
    ViewShipmentComponent,
    UploadComponent,
    DisplayShipmentComponent,
    FindShipmentComponent,
    MakeQuotationComponent,
    ManageQuotationComponent,
    LiveTrackingComponent,
    EditShipmentComponent,
    AccountVerifiedComponent,
    EmailSentComponent,
    ManageDriverComponent,
    GenerateInvoiceComponent,


  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    LoadingBarModule,
    FormsModule,
    ReactiveFormsModule ,
    HttpClientModule,
    BrowserAnimationsModule,
    SelectDropDownModule,
    NgxPaginationModule,
    MatTableModule,
    MatDialogModule,
    MatCardModule,
    MatGridListModule,
    FileUploadModule,
    ToastrModule.forRoot(),
    MatPaginatorModule,
    MatFormFieldModule,
    GooglePlaceModule,
    AgmCoreModule.forRoot({
      apiKey: 'Your Google API Key'
    }),
    AgmDirectionModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }, UserService, DiscussService, DataService, AuthGuard,TransporterAuthGuard],

  bootstrap: [AppComponent]
})
export class AppModule { }



