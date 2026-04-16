import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { ApiService } from '../../Services/apiservice';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { OnInit } from '../../../../node_modules/@angular/core/types/core';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
@Injectable({
  providedIn: 'root'
})
export class Login implements OnInit{
  email: string = '';
otp: string = '';
private DEVICE_KEY = 'deviceId';
showPopup = false;
popupMessage = '';
showotp=false;
// deviceid='';
constructor(
   private router: Router,
  // private alertController: AlertController,
   private apiService: ApiService,private cdr: ChangeDetectorRef
) {}
ngOnInit(): void {
  this.generateFingerprint();
}
getDeviceId(): string {
  let deviceId = localStorage.getItem(this.DEVICE_KEY) ?? ''; // <-- default empty string
  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem(this.DEVICE_KEY, deviceId);
  }
  return deviceId;
}

 async generateFingerprint(): Promise<void> {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  // this.visitorId = result.visitorId; // works if `this` is correct
  localStorage.setItem(this.DEVICE_KEY, result.visitorId);

    // return result.visitorId;
  // return ;
  // console.log(this.visitorId);
}

onSubmit() {
  console.log(this.email, this.otp);
  this.logincheck(this.email);
}
async logincheck(userid: string) {

  // Read login flag from sessionStorage
  const loginStr = localStorage.getItem('Login');
  const login = loginStr ? parseInt(loginStr, 10) : 0;

  // Get device ID
  //   const deviceid =  this.generateFingerprint();
  //  console.log('Device ID:',deviceid);
  const deviceid=localStorage.getItem(this.DEVICE_KEY);
  console.log(deviceid);
  // Prepare login details
  const logindetail = {
    email: userid,
    deviceid: deviceid
  };

  const queryName = 'mobile/LoginValid';

  try {
    // Call API
    // const response: any = await this.apiService.login(logindetail, queryName);
    this.apiService.login(logindetail, queryName).subscribe((response)=>{
      console.log(response);
      if (response.valid === false && response.message === 'partydetailnotfound') {
        this.showPopup=true;
        this.popupMessage='Please enter registered Email.'
        this.email = '';
        return;
      }
      localStorage.setItem('email', response.email);

      // Case 2: User valid and already logged in
      if (response.valid === true ) {
        this.apiService.getlogininfo(response.email).subscribe((infoResponse)=>{
          const data = infoResponse;
          console.log('Login Info:', data);

          localStorage.setItem('Empid', data[0].data[0].EmployeeId.toString());
          localStorage.setItem('EmpName', data[0].data[0].PartyName);
          localStorage.setItem('CompanyId', data[0].data[0].CompanyId);

          this.router.navigate(['app/home'], { replaceUrl: true });
          return;
        });
        // const infoResponse: any =  this.apiService.getlogininfo(response.email);

      }

      // Case 3: Device mismatch
      if (response.valid === false && response.message === 'devicenotsame') {
        // this.showPopup=true;
        // this.popupMessage='Please enter registered Email.'
        this.showotp=true;
         this.sendEmail(); // send OTP
      // this.router.navigate(['app/home'], { replaceUrl: true });
         return;
      }

      // Case 4: User inactive
      if (response.valid === false && response.message === 'User inactive') {
        this.showPopup=true;
        this.popupMessage='Your login access is currently inactive. Please contact the administrator.'
        // this.showError(
        //   'Your login access is currently inactive. Please contact the administrator.'
        // );
        return;
      }else{//new user
        this.showotp=true;

         this.sendEmail(); // send OTp
      }
      this.cdr.detectChanges();

    });
  }
  catch (error) {
    console.error('Login error:', error);
    this.showError('Something went wrong. Please try again.');
  }
}
showError(message: string) {
  this.popupMessage = message;
  this.showPopup = true;
}
closePopup() {
  this.showPopup = false;
}
async sendEmail() {
  // Generate 4-digit OTP
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  console.log('OTP:', randomNumber);

  // Save OTP to sessionStorage
  localStorage.setItem('otp', randomNumber.toString());

  // Get email from sessionStorage
  const email = localStorage.getItem('email');

  if (email) {
    try {
      // Call your API to send email
      this.apiService.emailsent(email, randomNumber).subscribe((response)=>{
        console.log('Email sent response:', response);
      });

    } catch (error) {
      console.error('Error sending email:', error);
    }
  } else {
    console.warn('Email not found in localStorage');
  }
}

}
