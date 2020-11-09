import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MapsAPILoader } from '@agm/core';
import {environment} from 'src/environments/environment';

import { Shipment } from '../Class/shipment';
import { Observable } from 'rxjs/internal/Observable';
import { Location } from '../customer/ManageShipments/view-shipment/Location';


declare var google: any;
@Injectable({
  providedIn: 'root'
})
export class DataService {

  private geocoder: any;

  constructor(private _http: HttpClient,private mapLoader: MapsAPILoader) { }

  postProblem(data) {
    return this._http.post<any>(environment.apiEndPoint + '/addproblem', data);
  }

  getProblems() {
    return this._http.get<any>(environment.apiEndPoint + '/problems');
  }
  getProblem(data) {
    return this._http.get<any>(environment.apiEndPoint + '/problem?problemCode=' + data);
  }

  postContest(data) {
    return this._http.post<any>( environment.apiEndPoint + '/createContest', data);
  }

  getContests() {
    return this._http.get<any>(environment.apiEndPoint + '/getContests');
  }

  getContest(data) {
    return this._http.get<any>(environment.apiEndPoint + '/getContest?contestCode=' + data);
  }
  updateContest(data) {
    return this._http.post<any>(environment.apiEndPoint + '/updateContest' , data);
  }

  compileCode(data) {
    return this._http.post<any>(environment.apiEndPoint + '/compilecode' , data);
  }
  compileContestCode(data) {
    return this._http.post<any>(environment.apiEndPoint + '/submitsolution' , data);
  }

  findAllProblem(data) {
    return this._http.post<any>(environment.apiEndPoint + '/findAllProblems' , data);
  }
  getRankList(data) {
    return this._http.post<any>(environment.apiEndPoint + '/getRankList' ,  data);
  }

  getSolutionHistory() {
    return this._http.get(environment.apiEndPoint + '/getSolutionHistory');
  }
  getFile(data) {
    return this._http.post<any>(environment.apiEndPoint + '/getFile' ,  data);
  }

  getSolutionHistoryById(data) {
    // tslint:disable-next-line:max-line-length
    return this._http.get<any>(environment.apiEndPoint.concat('/getSolutionHistoryById'), {headers : {'userid' : data, 'NoAuth' : 'True' }});
  }
// ######################### For ShipME ###################
  postShipment(formData) {
    return this._http.post<any>(environment.apiEndPoint + '/addshipment', formData);
  }

  getShipments() {
    return this._http.get<any>(environment.apiEndPoint + '/shipments');
  }

  getShipment(data) {
    return this._http.get<any>(environment.apiEndPoint + '/shipments/' + data);
  }

  getShipmentById(data) {
    // tslint:disable-next-line:max-line-length
    return this._http.get<any>(environment.apiEndPoint.concat('/getShipmentById'), {headers : {'userid' : data, 'NoAuth' : 'True' }});
  }

  getQuotationByShipment(shipmentCode){
    return this._http.get<any>(environment.apiEndPoint + '/quotation/' + shipmentCode);
  }

  getQuotationByUser(transporterId){
    return this._http.get<any>(environment.apiEndPoint + '/transporterQuotation/' + transporterId);
  }

  getQuotationForEdit(data){
    return this._http.get<any>(environment.apiEndPoint + '/quotationForEdit', {params : data});
  }

  getShipmentForEdit(data){
    return this._http.get<any>(environment.apiEndPoint + '/shipmentForEdit', {params : data});
  }

  editQuotation(formData){
    return this._http.put<any>(environment.apiEndPoint + '/quotation', formData);

  }

  editShipment(formData){
    return this._http.put<any>(environment.apiEndPoint + '/shipment', formData);
  }


  postQuotation(formData){
    return this._http.post<any>(environment.apiEndPoint + '/quotation', formData);
  }

  getQuotation(){
    return this._http.get<any>(environment.apiEndPoint + '/quotation');
  }

  deleteQuotation(data){
    return this._http.delete<any>(environment.apiEndPoint.concat('/deleteQuotation'),{params : data});
  }

  deleteShipment(data){
    return this._http.delete<any>(environment.apiEndPoint.concat('/deleteShipment'),{params : data});
  }

  acceptQuotation(data){
    return this._http.put<any>(environment.apiEndPoint.concat('/acceptQuotation'), data);
  }

  completeShipment(data){
    return this._http.put<any>(environment.apiEndPoint.concat('/completeShipment'), data);
  }

  getShipmentHistory(data){
    return this._http.get<any>(environment.apiEndPoint.concat('/completedShipment'), {params : data});
  }

  postLocation(data){
    return this._http.post<any>(environment.apiEndPoint.concat('/location'),data);
  }

  getLocation(data){
    return this._http.get<any>(environment.apiEndPoint.concat('/location'),{params : data});
  }

  finishQuotation(data){
    return this._http.put<any>(environment.apiEndPoint.concat('/finishQuotation'), data);
  }

  addDrivers(data){
    return this._http.put<any>(environment.apiEndPoint.concat('/addDrivers'), data);
  }
 
  getDrivers(data){
    return this._http.get<any>(environment.apiEndPoint.concat('/getDrivers'),{params : data});
  }
 
  deleteDriver(data){
    return this._http.delete<any>(environment.apiEndPoint.concat('/deleteDriver'),{params : data});
  }



  uploadReceipt(data){
    return this._http.post<any>(environment.apiEndPoint.concat('/uploadReceipt'), data);
  }

  getReceipt(data) {
    return this._http.get<any>(environment.apiEndPoint + '/getReceiptbyCode/' + data);
  }
  





  private initGeocoder() {
    this.geocoder = new google.maps.Geocoder();
  }

  // private waitForMapsToLoad(): Observable<boolean> {
  //   if(!this.geocoder) {
  //     return fromPromise(this.mapLoader.load())
  //     .pipe(
  //       tap(() => this.initGeocoder()),
  //       map(() => true)
  //     );
  //   }
  //   return of(true);
  // }

  geocodeAddress(location: string): Observable<Location> {
    this.geocoder = new google.maps.Geocoder();
        return new Observable(observer => {
          this.geocoder.geocode({'address': location}, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
              observer.next({
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
              });
            } else {
                observer.next({ lat: 0, lng: 0 });
            }
            observer.complete();
          });
        })
    }

}
