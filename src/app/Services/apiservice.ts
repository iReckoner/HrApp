import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable ,of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // private apiUrl = 'http://192.168.0.128:4130'; //local
  //  private apiUrl = 'https://cloud.ireckoner.in:5000/api'; //staging
       private apiUrl = 'https://cloud.ireckoner.in:4130'; //live
  // private apiUrl = 'https://c0320e7d265d.ngrok-free.app/api';
  private profileid='staging';



  constructor(private http: HttpClient) {}
  token: any;
  headers: any;
  userName: any;
  apptype: any;

  getApiUrl(): string {
    return this.apiUrl;
  }
  getdata(employeeId : string , queryname : string):Observable<any>{
    const url=`${this.apiUrl}/${queryname}? ProfileId=${this.profileid}&param1=${employeeId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get(url);

  }

  login_old(data: { identifier: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }
  login(data: any, queryName: string): Observable<any> {
    try {
      const url = `${this.apiUrl}/${queryName}?ProfileId=${this.profileid}`;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      return this.http.post(url, data, { headers });

    } catch (error: any) {
      console.error('Login failed:', error);
      return  of(null);
    }
  }
  attendancereport(Queryname:string, EmployeeId :string, CompanyId : string, StartDate : string, EndDate : string): Observable<any> {
    try {
      let deviceId = localStorage.getItem('deviceId');
      const url = `${this.apiUrl}/${Queryname}?ProfileId=${this.profileid}&EmployeeId=${EmployeeId}&CompanyId=${CompanyId}&StartDate=${StartDate}&EndDate=${EndDate}`;
      const headers = new HttpHeaders({
        'DeviceId': deviceId??"",
        'Content-Type': 'application/json'
      });
      return this.http.get(url, { headers });

    } catch (error: any) {
      console.error('Login failed:', error);
      return  of(null);
    }
  }
  detail(Queryname:string, EmployeeId :string, CompanyId : string): Observable<any> {
    try {
      let deviceId = localStorage.getItem('deviceId');
      const url = `${this.apiUrl}/${Queryname}?ProfileId=${this.profileid}&EmployeeId=${EmployeeId}&CompanyId=${CompanyId}`;
      const headers = new HttpHeaders({
        'DeviceId': deviceId??"",
        'Content-Type': 'application/json'
      });
      return this.http.get(url, { headers });

    } catch (error: any) {
      console.error('Login failed:', error);
      return  of(null);
    }
  }

  getlogininfo(email:string):Observable<any>{
    try {
      const url = `${this.apiUrl}/mobile/getemployeeInformation?email=${email}&ProfileId=${this.profileid}`;

      console.log(url);

      // const response = await firstValueFrom(
      //   this.http.get(url)
      // );
      return this.http.get(url);

    } catch (error) {
      console.error('Error fetching login info:', error);
      return of(null);
    }
  }
  emailsent(email:string,otp:number):Observable<any>{
    try {
      const url = `${this.apiUrl}/mobile/sendemail?mail=${email}&otp=${otp}`;

      console.log(url);

      // const response = await firstValueFrom(
      //   this.http.get(url)
      // );

      return this.http.get(url);

    } catch (error) {
      console.error('Error sending email:', error);
      return of(null) ;
    }
  }
  sendOtp(identifier: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/sendOtp`, { identifier });
  }

  verifyOtp(identifier: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/verifyOtp`, { identifier, otp });
  }
  verifyOtp1(identifier: string, otp: string, VisitorId: any,hardLogin:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/verifyOtp1`, { 'LoginId': identifier,  'VisitorId': VisitorId,hardLogin: hardLogin,'otp':otp});
  }
  executePmtdata(ContactId:string): Observable<any > {
    // const contactId = localStorage.getItem('contactId');
    const payload = {
      ContactId: ContactId,
    };
    return this.http.post(`${this.apiUrl}/config/executePmt`, payload);
  }
  postLeave(Queryname:string,data:any,EmployeeId:string,CompanyId :string){
    let deviceId = localStorage.getItem('deviceId');
    const headers = new HttpHeaders({
      'DeviceId': deviceId??"",
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrl}/${Queryname}?ProfileId=${this.profileid}&EmployeeId=${EmployeeId}&CompanyId=${CompanyId}&DocumentAction=1&DocGen=0`, data,{headers});
  }



}
