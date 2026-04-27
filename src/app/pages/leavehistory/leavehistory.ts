import { Component } from '@angular/core';
import { OnInit } from '../../../../node_modules/@angular/core/types/core';
import { ApiService } from '../../Services/apiservice';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
interface LeaveRecord {
  type: string;
  date: string;
  duration: string;
  status: 'Draft' | 'Approved' | 'Pending';
}
@Component({
  selector: 'app-leavehistory',
  imports: [],
  templateUrl: './leavehistory.html',
  styleUrl: './leavehistory.css',
})
export class Leavehistory implements OnInit {
  leaveData: LeaveRecord[] = [];
  currentMonth = new Date().toLocaleString('en-US', {
   month: 'long',
   year: 'numeric'
 });
  month = new Date().toLocaleString('en-US', { month: '2-digit' });
  year = new Date().getFullYear().toString();

 alldetails:[]=[];
 constructor(
   private router: Router,
  // private alertController: AlertController,
   private apiService: ApiService,private cdr: ChangeDetectorRef
) {}

 ngOnInit() {
   this.Leavereport(this.month,this.year);
 }

 onMonthSelect(event: any) {
   const selectedValue = event.target.value; // Format: "2026-03"
   if (!selectedValue) return;

   const [year, month] = selectedValue.split('-');

   // Format for display (e.g., "March 2026")
   const date = new Date(parseInt(year), parseInt(month) - 1);
   this.currentMonth = date.toLocaleString('default', { month: 'long', year: 'numeric' });
   this.Leavereport(month ,year );
 }

 async Leavereport(month:string, year:string) {
   const queryName = 'mobile/getLeaveHistory';
   let employeeId=localStorage.getItem('Empid');
   let CompanyId=localStorage.getItem('CompanyId');
   try {
     this.apiService.attendancereport( queryName,employeeId??"",CompanyId??"",month,year).subscribe((response)=>{
       console.log(response);
       this.alldetails = response[0].data;
       const data = response[0]?.data || [];
       this.leaveData = data.map((item: any) => {
       const date = item.DocStartDate.split('T')[0];
      //  let duration = item.LateByMinutes;
         return {
          type:item.LeaveName,
           date: date,
           duration: item.LeaveTaken,
           status:item.Status,
         };
       });
       console.log(this.leaveData);
       setTimeout(() => {
         this.cdr.detectChanges(); // notify Angular
       }, 0);
     });
   }
   catch (error) {
     console.error('Leave history error:', error);
     // this.showError('Something went wrong. Please try again.');
   }
 }
}
