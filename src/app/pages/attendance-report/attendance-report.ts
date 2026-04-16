import { Component } from '@angular/core';
import { OnInit } from '../../../../node_modules/@angular/core/types/core';
import { ApiService } from '../../Services/apiservice';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
export interface AttendanceRecord {
  date: string;     // e.g., "2026-03-01"
  duration: number; // e.g., 15 (minutes)
}

@Component({
  selector: 'app-attendance-report',
  imports: [],
  templateUrl: './attendance-report.html',
  styleUrl: './attendance-report.css',
})
export class AttendanceReport implements OnInit {
  attendanceData: AttendanceRecord[] = [];
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
    this.attendancereport(this.month,this.year);
  }

  onMonthSelect(event: any) {
    const selectedValue = event.target.value; // Format: "2026-03"
    if (!selectedValue) return;

    const [year, month] = selectedValue.split('-');

    // Format for display (e.g., "March 2026")
    const date = new Date(parseInt(year), parseInt(month) - 1);
    this.currentMonth = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    this.attendancereport(month ,year );
  }

  async attendancereport(month:string, year:string) {
    const queryName = 'mobile/getattendancereport';
    let employeeId=localStorage.getItem('Empid');
    let CompanyId=localStorage.getItem('CompanyId');
    try {
      this.apiService.attendancereport( queryName,employeeId??"",CompanyId??"",month,year).subscribe((response)=>{
        console.log(response);
        this.alldetails = response[0].data;
        const data = response[0]?.data || [];
        this.attendanceData = data.map((item: any) => {
        const date = item.PunchDate.split('T')[0];
        let duration = item.LateByMinutes;
          return {
            date: date,
            duration: Math.round(duration)
          };
        });
        console.log(this.attendanceData);
        setTimeout(() => {
          this.cdr.detectChanges(); // notify Angular
        }, 0);
      });
    }
    catch (error) {
      console.error('Login error:', error);
      // this.showError('Something went wrong. Please try again.');
    }
  }
}
