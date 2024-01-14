import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AdminAuthService } from './admin-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {

  private baseUrl = 'http://172.17.81.34:8080/api/';
  private adminloginUrl = this.baseUrl + 'admin/login';
  private subscribe = this.baseUrl + 'subscription/list';
  private PackageUrl = this.baseUrl + 'package/';
  private BulkUserParamsUrl = this.baseUrl + 'user/bulk_user_params/';
  private downloadSubscriptionUrl = this.baseUrl + 'subscription/download';
  private BulkURL = this.baseUrl + 'user/bulk_user/';
  private addMenu = this.baseUrl + 'package/menus';
  private update_Password_Url = this.baseUrl + 'admin/change_password';
  private forgot_password = this.baseUrl + 'admin/forgotpassword';
  private reset_password = this.baseUrl + 'admin/forgotpassword';

  constructor(private http: HttpClient, private router: Router, private adminAuth: AdminAuthService) { }

  private getAdminHeaders() {
    const admintoken = this.adminAuth.getAdminToken();
    return new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${admintoken}`
    });
  }

  private handleAdminHttpError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      this.adminAuth.logout();
      this.router.navigate(['admin/admin-login']);
    }
    return throwError(error);
  }

  private handleSessionExpiredResponse(response: any): void {
    if (response && response.error === 1) {
      console.log('Session Expired. Logging out and redirecting...');
      this.adminAuth.logout();
      this.router.navigate(['admin/admin-login']);
    }
  }

  public handleApiResponse(response: any): any {
    this.handleSessionExpiredResponse(response);
    return response;
  }


  private handleAdminObservableError<T>(source: Observable<T>): Observable<T> {
    return source.pipe(catchError((error: HttpErrorResponse) => this.handleAdminHttpError(error)));
  }

  public getBulkUserParams(): Observable<any> {
    const headers = this.getAdminHeaders();
    return this.handleAdminObservableError(this.http.get(this.BulkUserParamsUrl, { headers }));
  }

  public downloadSubscription(): Observable<any> {
    const headers = this.getAdminHeaders();
    return this.handleAdminObservableError(this.http.get(this.downloadSubscriptionUrl, {
      headers, responseType: 'blob'
    }));
  }

  public getUser(): Observable<any> {
    const headers = this.getAdminHeaders();
    const url = `${this.baseUrl}user/`;

    return this.http.get<any>(url, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleAdminHttpError(error);
        return EMPTY;
      }),
      map((response: any) => {
        this.handleApiResponse(response);
        return response;
      })
    );
  }



  public getfilteredCategories(package_id: any): Observable<any> {
    const headers = this.getAdminHeaders();
    const url = this.PackageUrl + `${package_id}`;
    return this.handleAdminObservableError(this.http.get(url, { headers }));
  }

  getadminCategories(): Observable<any> {
    const headers = this.getAdminHeaders();
    const url = this.PackageUrl;
    return this.handleAdminObservableError(this.http.get(url, { headers }));
  }


  getsubPackage(package_id: string): Observable<any> {
    const headers = this.getAdminHeaders();
    const url = `${this.baseUrl}sub_packages/?package_id=${package_id}`;
    return this.handleAdminObservableError(this.http.get<any>(url, { headers }));
  }

  getSubTopic(topic_id: any): Observable<any> {
    const headers = this.getAdminHeaders();
    const url = `${this.baseUrl}categories/?subpackage_id=${topic_id}`;
    return this.handleAdminObservableError(this.http.get<any>(url, { headers }));
  }




  public getfilteredsubpackage(subpackage_id: any): Observable<any> {
    const headers = this.getAdminHeaders();
    const url = `${this.baseUrl}sub_packages/${subpackage_id}`;
    return this.handleAdminObservableError(this.http.get<any>(url, { headers }));

  }


  public getDelay(): Observable<any> {
    const headers = this.getAdminHeaders();
    const url = `${this.baseUrl}delay/`;
    return this.handleAdminObservableError(this.http.get<any>(url, { headers }));
  }


  addDelay(delay_data: any): Observable<any> {
    const headers = this.getAdminHeaders();
    return this.handleAdminObservableError(this.http.post(`${this.baseUrl}delay/`, delay_data, { headers }));
  }

  bulkUser(formData: FormData): Observable<any> {
    const headers = this.getAdminHeaders();
    return this.handleAdminObservableError(this.http.post(`${this.BulkURL}`, formData, { headers }));
  }
  menuPreference(file: File): Observable<any> {
    const headers = this.getAdminHeaders();
    const formData = new FormData();
    formData.append('menu_file', file, file.name);

    return this.handleAdminObservableError(
      this.http.post(`${this.addMenu}`, formData, { headers })
    );
  }

  UpdatePassword(UpdateDate: any): Observable<any> {
    const headers = this.getAdminHeaders();
    return this.handleAdminObservableError(this.http.post(`${this.update_Password_Url}`, UpdateDate, { headers }));
  }


  addCategories(categoriesData: any): Observable<any> {
    const headers = this.getAdminHeaders();
    return this.handleAdminObservableError(this.http.post(`${this.baseUrl}categories/`, categoriesData, { headers }));
  }

  updateCategories(categoriesData: any): Observable<any> {
    const headers = this.getAdminHeaders();
    return this.handleAdminObservableError(this.http.put(`${this.baseUrl}categories/`, categoriesData, { headers }));
  }


  addsubPackage(subPackageData: any): Observable<any> {
    const headers = this.getAdminHeaders();
    return this.handleAdminObservableError(this.http.post(`${this.baseUrl}sub_packages/`, subPackageData, { headers }));
  }

  subscriptionList(subPackageData: any): Observable<any> {
    const headers = this.getAdminHeaders();
    const url = `${this.subscribe}`;

    const requestBody: any = {
      user_id: subPackageData.user_id,
      subscription_id: subPackageData.subscription_id,
      subscription_type: subPackageData.subscription_type,
      category_code: subPackageData.category_code,
      package_code: subPackageData.package_code,
      sub_package_code: subPackageData.sub_package_code,
    };

    if (subPackageData.from_amount !== undefined || subPackageData.to_amount !== undefined) {
      requestBody.amount = {
        from_amount: subPackageData.from_amount,
        to_amount: subPackageData.to_amount,
      };
    }

    if (subPackageData.from_date !== undefined || subPackageData.to_date !== undefined) {
      requestBody.subscription_until = {
        from_date: subPackageData.from_date,
        to_date: subPackageData.to_date,
      };
    }
    return this.handleAdminObservableError(this.http.post<any>(url, requestBody, { headers }));
  }


  subscriptionListAll(): Observable<any> {
    const headers = this.getAdminHeaders();
    const url = `${this.subscribe}`;
    return this.handleAdminObservableError(this.http.post<any>(url, { headers }));
  }





  updatesubPackage(subPackageData: any): Observable<any> {
    const headers = this.getAdminHeaders();
    return this.handleAdminObservableError(this.http.put(`${this.baseUrl}sub_packages/`, subPackageData, { headers }));
  }


  addPackage(packageData: any): Observable<any> {
    const headers = this.getAdminHeaders();
    return this.handleAdminObservableError(this.http.post(this.PackageUrl, packageData, { headers }));
  }


  updatePackage(packageData: any): Observable<any> {
    const headers = this.getAdminHeaders();
    return this.handleAdminObservableError(this.http.put(this.PackageUrl, packageData, { headers }));
  }


  subscription(subscribeData: any): Observable<any> {
    const headers = this.getAdminHeaders();
    return this.handleAdminObservableError(this.http.post(this.subscribe, subscribeData, { headers }));
  }

  adminlogIn(logInData: any): Observable<any> {
    const headers = this.getAdminHeaders();
    return this.handleAdminObservableError(this.http.post(this.adminloginUrl, logInData, { headers }));
  }

  adminForgotPassowrd(logInData: any): Observable<any> {
    const headers = this.getAdminHeaders();
    return this.handleAdminObservableError(this.http.post(this.forgot_password, logInData, { headers }));
  }


  adminresetpassword(logInData: any): Observable<any> {
    const headers = this.getAdminHeaders();
    return this.handleAdminObservableError(this.http.post(this.reset_password, logInData, { headers }));
  }


}
