import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { ReplaySubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://172.17.81.34:8080/api/';
  private SignalRUrl = 'http://172.17.81.34:5608/informist/hubs/negotiate';
  private userProfileUrl = this.baseUrl + 'user/me/';
  private usernotificationUrl = this.baseUrl + 'user/notification';
  private packageApiUrl = this.baseUrl + 'package/?status=ACTIVE';
  private updateProfileApiUrl = this.baseUrl + 'user/updateprofile';
  private signUpUrl = this.baseUrl + 'signup';
  private forgotpasswordUrl = this.baseUrl + 'user/forgotpassword';
  private loginUrl = this.baseUrl + 'user/login';
  private changePasswordUrl = this.baseUrl + 'user/change_password';
  private loginUrl_WAT = this.baseUrl + 'login';
  private otpverify_WAT = this.baseUrl + 'otpverify';
  private adminloginUrl = this.baseUrl + 'admin/login';
  private topicpricesUrl = this.baseUrl + 'price/topicprices';
  private subscribe = this.baseUrl + 'subscription/list';
  private resetUrl = this.baseUrl + 'user/resetpassword';
  private PackageUrl = this.baseUrl + 'package/';
  private ScheduleCallBackUrl = this.baseUrl + 'user/schedule_callback';
  private companiesDataUrl = this.baseUrl + 'categories/master_company/';
  private companiesSubject = new ReplaySubject<any[]>(1);


  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthenticationService
  ) { }

  private getUserHeaders(): HttpHeaders {
    const authToken = this.authService.getToken();
    return new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${authToken}`
    });
  }

  private handleHttpError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
    return throwError(error);
  }

  private handleSessionExpiredResponse(response: any): void {
    if (response && response.error === 1) {
      console.log('Session Expired. Logging out and redirecting...');
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  public handleApiResponse(response: any): any {
    this.handleSessionExpiredResponse(response);
    return response;
  }

  private handleObservableError<T>(source: Observable<T>): Observable<T> {
    return source.pipe(catchError((error: HttpErrorResponse) => this.handleHttpError(error)));
  }

  scheduleCallBack(): Observable<any> {
    const headers = this.getUserHeaders();
    const options = { headers: headers };
    return this.handleObservableError(this.http.post(this.ScheduleCallBackUrl, {}, options));
  }

  public getNotification(): Observable<any> {
    const headers = this.getUserHeaders();
    return this.handleObservableError(this.http.post(this.usernotificationUrl, {}, { headers }));
  }

  public getCategories(): Observable<any> {
    const headers = this.getUserHeaders();
    return this.http.get(this.packageApiUrl, { headers });
  }

  public userProfile(): Observable<any> {
    const headers = this.getUserHeaders();
    return this.handleObservableError(this.http.get(this.userProfileUrl, { headers }));
  }

  getadminCategories(): Observable<any> {
    const headers = this.getUserHeaders();
    const url = this.PackageUrl;
    return this.handleObservableError(this.http.get(url, { headers }));
  }

  public getfilteredCategories(package_id: any): Observable<any> {
    const headers = this.getUserHeaders();
    const url = `${this.PackageUrl}${package_id}`;
    return this.handleObservableError(this.http.get(url, { headers }));
  }

  public getfilteredProfile(): Observable<any> {
    const headers = this.getUserHeaders();
    const url = `${this.baseUrl}user/`;
    return this.handleObservableError(this.http.get<any>(url, { headers }));
  }

  getCart(): Observable<any> {
    const headers = this.getUserHeaders();
    const url = `${this.baseUrl}subscription/cart`;
    return this.handleObservableError(this.http.get<any>(url, { headers }));
  }

  addCart(subscribeData: any): Observable<any> {
    const headers = this.getUserHeaders();
    return this.handleObservableError(this.http.post(`${this.baseUrl}subscription/cart/`, subscribeData, { headers }));
  }

  subscribePackage(): Observable<any> {
    const headers: HttpHeaders = this.getUserHeaders();
    return this.handleObservableError(this.http.post(`${this.baseUrl}subscription/`, null, { headers }));
  }

  deleteCartPackage(package_id: any): Observable<any> {
    const headers = this.getUserHeaders();
    const url = `${this.baseUrl}subscription/cart?package_id=${package_id}`;
    return this.handleObservableError(this.http.delete<any>(url, { headers }));
  }

  subscriptionList(): Observable<any> {
    const headers = this.getUserHeaders();
    const url = `${this.subscribe}`;
    const options = { headers: headers };

    return this.handleObservableError(this.http.post<any>(url, {}, options)).pipe(
      map((response: any) => {
        this.handleSessionExpiredResponse(response);
        return response;
      })
    );
  }

  // public subscriptionList(): Observable<any> {
  //   const headers = this.getUserHeaders();
  //   const url = `${this.subscribe}`;

  //   return this.http.get<any>(url, { headers }).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       this.handleHttpError(error);
  //       return EMPTY;
  //     }),
  //     map((response: any) => {
  //       this.handleApiResponse(response);
  //       return response;
  //     })
  //   );
  // }





  topicPrices(topicpricesdata: any): Observable<any> {
    const headers = this.getUserHeaders();
    return this.handleObservableError(this.http.post(this.topicpricesUrl, topicpricesdata, { headers }));
  }

  changePassword(changePasswordData: any): Observable<any> {
    const headers = this.getUserHeaders();
    return this.handleObservableError(this.http.post(this.changePasswordUrl, changePasswordData, { headers }));
  }

  getTopic(package_id: string): Observable<any> {
    const headers = this.getUserHeaders();
    const url = `${this.baseUrl}sub_packages/?package_id=${package_id}&status=ACTIVE`;
    return this.handleObservableError(this.http.get<any>(url, { headers }));
  }

  getCompanies(): Observable<any> {
    const headers = this.getUserHeaders();
    return this.handleObservableError(this.http.get<any>(this.companiesDataUrl, { headers }));
  }


  getCompanieswithName(searchText: string): Observable<any[]> {
    const params = { name: searchText };
    return this.http.get<any[]>(`${this.baseUrl}categories/master_company/`, { params });
  }


  getSubTopic(topic_id: any): Observable<any> {
    const headers = this.getUserHeaders();
    const url = `${this.baseUrl}categories/?subpackage_id=${topic_id}`;
    return this.handleObservableError(this.http.get<any>(url, { headers }));
  }

  forgotpassword(username: any): Observable<any> {
    return this.handleObservableError(this.http.post(this.forgotpasswordUrl, username));
  }

  resetpassword(resetData: any): Observable<any> {
    return this.handleObservableError(this.http.post(this.resetUrl, resetData));
  }

  signUp(signUpData: any): Observable<any> {
    return this.handleObservableError(this.http.post(this.signUpUrl, signUpData));
  }

  logIn(logInData: any): Observable<any> {
    return this.http.post(this.loginUrl, logInData);
  }

  SignalRAccessTocken(): Observable<any> {
    return this.http.post(this.SignalRUrl, {});
  }

  requestOTP(loginData: any): Observable<any> {
    return this.handleObservableError(this.http.post(this.loginUrl_WAT, loginData));
  }

  updateProfile(profileData: any): Observable<any> {
    const headers = this.getUserHeaders();
    return this.handleObservableError(this.http.post(this.updateProfileApiUrl, profileData, { headers }));
  }

  getOtp(mobile_number: string): Observable<any> {
    const headers = this.getUserHeaders();
    const params = new HttpParams().set('mobile_number', mobile_number);
    const options = {
      headers: headers,
      params: params
    };
    return this.handleObservableError(this.http.get(`${this.baseUrl}user/login`, options));
  }

  verifyOtp(mobile_number: string, otp: string): Observable<any> {
    return this.handleObservableError(this.http.get(`${this.baseUrl}user/otpverify?mobile_no=${mobile_number}&otp=${otp}`));
  }

  verifyOtp_WAT(mobile_number: string, otp: string): Observable<any> {
    return this.handleObservableError(this.http.get(`${this.otpverify_WAT}?mobile_no=${mobile_number}&otp=${otp}`));
  }

  adminlogIn(logInData: any): Observable<any> {
    return this.handleObservableError(this.http.post(this.adminloginUrl, logInData));
  }

  // Admin Panel Data methods...

  navigateToHomePage() {
    this.router.navigate(['/communication']);
  }
}
