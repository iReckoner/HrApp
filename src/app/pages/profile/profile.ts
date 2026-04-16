import { Component } from '@angular/core';
import { OnInit } from '../../../../node_modules/@angular/core/types/core';
import { Router } from '@angular/router';
import { ApiService } from '../../Services/apiservice';
import { ChangeDetectorRef } from '@angular/core';
interface User {
  name: string;
  role: string;
  employeeId: string;
  email: string;
  birthday: string;
  department: string;
  joiningDate: string;
  location: string;
  confirmationDate?: string;
  panNo?: string;
  UanNo?: string; // optional
}

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  user: any = {};
  // user = {
  //   name: 'Aayushi Gupta',
  //   role: 'Trainee',
  //   employeeId: '57000151',
  //   email: 'aayushigupta795@gmail.com',
  //   birthday: 'October 10 2000',
  //   department: 'Development',
  //   joiningDate: 'September 04 2023',
  //   location: 'New Delhi'
  // };

  // profileFields = [
  //   { label: 'Email', value: this.user.email, icon: 'email' },
  //   { label: 'Birthday', value: this.user.birthday, icon: 'cake' },
  //   { label: 'Department', value: this.user.department, icon: 'business' },
  //   { label: 'Joining Date', value: this.user.joiningDate, icon: 'calendar_today' },
  //   { label: 'Location', value: this.user.location, icon: 'location_on' },
  //   { label: 'Confirmation Date', value: '--', icon: 'event_available' }
  // ];
  profileFields = [
    // { label: 'Email', key: 'email', icon: 'email' },
    { label: 'Birthday', key: 'birthday', icon: 'cake' },
    { label: 'Department', key: 'department', icon: 'business' },
    { label: 'Joining Date', key: 'joiningDate', icon: 'calendar_today' },
    { label: 'Location', key: 'location', icon: 'location_on' },
    { label: 'Confirmation Date', key: 'confirmationDate', icon: 'event_available' },
    { label: 'Pan No', key: 'panNo', icon: 'event_available' },
    { label: 'Uan No', key: 'uanNo', icon: 'event_available' }
  ];
  // employeedetails=[];
  employeedata:[]=[];
  constructor(
    private router: Router,
    private apiService: ApiService,private cdr: ChangeDetectorRef
 ) { }
  ngOnInit(): void {
    this.employeedetails();
    // throw new Error('Method not implemented.');
  }
  logout(){
    this.router.navigate(['/'], { replaceUrl: true });
  }
  employeedetails(){
    const employeeId=localStorage.getItem('Empid');
    const CompanyId=localStorage.getItem('CompanyId');
    const queryname = 'mobile/getprofileInformation';
    this.apiService.detail(queryname,employeeId??"",CompanyId??"").subscribe((response)=>{
    this.employeedata=response[0].data;
    const data = response[0].data[0];
    this.user = {
      name: data.PartyName,
      role: data.Designation,
      employeeId: data.EmployeeId,
      email: data.email,
      birthday: data.BDate,
      department: data.Department,
      joiningDate: data.joindate,
      location: data.Location,
      confirmationDate: data.conformationdate,
      panNo:data.PanNo,
      uanNo:data.PFAccNo
    };
    console.log(this.employeedata);
    this.cdr.detectChanges();
    })
  }
  getValue(key: keyof User): string {
    return this.user?.[key] || '--';
  }
}
