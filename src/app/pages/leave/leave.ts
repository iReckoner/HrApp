import { Component } from '@angular/core';
import { OnInit } from '../../../../node_modules/@angular/core/types/core';
import { Router } from '@angular/router';
import { ApiService } from '../../Services/apiservice';
import { ChangeDetectorRef } from '@angular/core';
// import { NavigationEnd } from '../../../../node_modules/@angular/router/types/router';
// import { filter } from '../../../../node_modules/rxjs/dist/types/index';
// import { NavigationEnd } from '../../../../node_modules/@angular/router/types/_router_module-chunk';
// import { Init } from 'v8';
// import { OnInit } from '../../../../node_modules/@angular/core/types/core';
export interface LeaveBalance {
  type: string;
  taken: number;
  total: number;
  color: string; // e.g., 'text-pink-400'
  bgColor: string; // e.g., 'bg-pink-50'
}

export interface LeaveHistory {
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Draft' | 'Approved' | 'Pending';
}
export interface Upcomingholiday {
  type: string;
  startDate: string;
}

@Component({
  selector: 'app-leave',
  imports: [],
  templateUrl: './leave.html',
  styleUrl: './leave.css',
})
export class Leave implements OnInit {
  constructor(

    private router: Router,
   // private alertController: AlertController,
    private apiService: ApiService,private cdr: ChangeDetectorRef
 ) {
  // this.router.events
  //   .pipe(filter(event => event instanceof NavigationEnd))
  //   .subscribe(() => {
  //     this.loadAllData(); // 🔥 reload every time screen opens
  //   });
 }
 balances:LeaveBalance[]=[];
 recentLeaves: LeaveHistory[] =[];
 upcomingleave:Upcomingholiday[]=[];
  ngOnInit(): void {
    this.loadAllData();

  }
  loadAllData() {
    debugger;
    this.leavebalance();
    this.leavehistory();
    this.upcomingholiday();
    // this.cdr.detectChanges();
  }
  getColor(type: string): string {
    switch (type) {
      case 'Earned Leave': return 'text-red-400';
      case 'Casual Leave': return 'text-teal-500';
      case 'Sick Leave': return 'text-emerald-500';
      default: return 'text-gray-400';
    }
  }

  getBgColor(type: string): string {
    switch (type) {
      case 'Earned Leave': return 'bg-red-50';
      case 'Casual Leave': return 'bg-teal-50';
      case 'Sick Leave': return 'bg-emerald-50';
      default: return 'bg-gray-50';
    }
  }

  leavebalance(){
    const queryName = 'mobile/getLeaveReport';
    let employeeId=localStorage.getItem('Empid');
    let CompanyId=localStorage.getItem('CompanyId');
    try {
      this.apiService.detail( queryName,employeeId??"",CompanyId??"").subscribe((response)=>{
        console.log(response);
        const apiData = response?.[0]?.data || [];
        this.balances = apiData
        .filter((item: any) => item.LeaveId !== '00000004') // ❌ remove this
        .map((item: any) => ({
          type: item.LeaveName,
          taken: Number(item.LeavesTaken),
          total: Number(item.Total_Alloted_Leaves),
          color: this.getColor(item.LeaveName),
          bgColor: this.getBgColor(item.LeaveName)
        }));
        this.cdr.detectChanges();
      });
    }
    catch (error) {
      console.error('Leave Report error:', error);
      // this.showError('Something went wrong. Please try again.');
    }
  }
  leavehistory(){
    const queryName = 'mobile/getrecentLeaveHistory';
    let employeeId=localStorage.getItem('Empid');
    let CompanyId=localStorage.getItem('CompanyId');
    try {
      // Call API
      // const response: any = await this.apiService.login(logindetail, queryName);
      this.apiService.detail( queryName,employeeId??"",CompanyId??"").subscribe((response)=>{
        console.log(response);
        const apiData = response?.[0]?.data || [];
        this.recentLeaves = apiData
        // .filter((item: any) => item.LeaveId !== '00000004') // ❌ remove this
        .map((item: any) => ({
          type: item.LeaveName,
         startDate:item.FromDate.split('T')[0],
         endDate:item.ToDate.split('T')[0],
         reason:item.Remarks,
         status:item.Status
        }));
        this.cdr.detectChanges();
      });
      // setTimeout(() => {
      //   this.cdr.detectChanges(); // notify Angular
      // }, 0);
    }
    catch (error) {
      console.error('Login error:', error);
      // this.showError('Something went wrong. Please try again.');
    }
  }
  upcomingholiday(){
    const queryName = 'mobile/getUpcomingHoliday';
    let employeeId=localStorage.getItem('Empid');
    let CompanyId=localStorage.getItem('CompanyId');
    try {
      // Call API
      // const response: any = await this.apiService.login(logindetail, queryName);
      this.apiService.detail( queryName,employeeId??"",CompanyId??"").subscribe((response)=>{
        console.log(response);
        const apiData = response?.[0]?.data || [];
        this.upcomingleave = apiData
        // .filter((item: any) => item.LeaveId !== '00000004') // ❌ remove this
        .map((item: any) => ({
          type: item.LeaveName,
         startDate:item.FromDate.split('T')[0],
        }));
        this.cdr.detectChanges();
      });
      // setTimeout(() => {
      //   this.cdr.detectChanges(); // notify Angular
      // }, 0);
    }
    catch (error) {
      console.error('Upcoming Holiday error:', error);
      // this.showError('Something went wrong. Please try again.');
    }
  }
  goleavehistory(){
    this.router.navigate(['app/leavehistory']);
  }
}
