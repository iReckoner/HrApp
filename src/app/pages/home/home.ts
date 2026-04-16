import { Component,OnInit,NgZone  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../Services/apiservice';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { formatDate } from '@angular/common';
interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  status: 'present' | 'absent' | 'late' | 'unapproved' | 'upcoming' | 'weekend' | 'none';
}

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  latitude: string = '';
  longitude: string = '';
  showPopup: boolean = false;
popupMessage: string = '';
popupType: 'success' | 'error' = 'success';
  constructor(

    private router: Router,
   // private alertController: AlertController,
    private apiService: ApiService,private cdr: ChangeDetectorRef,private zone: NgZone
 ) {}
  // viewDate: Date = new Date(2026, 2, 1); // March 2026
  // calendarDays: CalendarDay[] = [];

  // // Mock Data Arrays (Mimicking your Flutter Lists)
  // presentDates = [new Date(2026, 2, 3), new Date(2026, 2, 7)];
  // absentDates = [new Date(2026, 2, 10)];
  // lateDates = [new Date(2026, 2, 2), new Date(2026, 2, 5), new Date(2026, 2, 6)];
  // upcomingHolidays = [new Date(2026, 2, 25)];

  // ngOnInit() {
  //   this.generateCalendar();
  // }

  // generateCalendar() {
  //   const year = this.viewDate.getFullYear();
  //   const month = this.viewDate.getMonth();

  //   // Logic to get the start of the grid (Monday of the first week)
  //   const firstDayOfMonth = new Date(year, month, 1);
  //   const startDay = firstDayOfMonth.getDay() === 0 ? -6 : 1 - firstDayOfMonth.getDay();

  //   const days: CalendarDay[] = [];
  //   for (let i = startDay; i < startDay + 42; i++) {
  //     const date = new Date(year, month, i);
  //     days.push({
  //       date,
  //       isCurrentMonth: date.getMonth() === month,
  //       isToday: this.isSameDate(date, new Date()),
  //       status: this.getDayStatus(date)
  //     });
  //   }
  //   this.calendarDays = days;
  // }

  // getDayStatus(date: Date): any {
  //   const isSaturday = date.getDay() === 6;
  //   const isSunday = date.getDay() === 0;
  //   const isFirstSaturday = isSaturday && date.getDate() <= 7;

  //   if (this.presentDates.some(d => this.isSameDate(d, date))) return 'present';
  //   if (this.absentDates.some(d => this.isSameDate(d, date))) return 'absent';
  //   if (this.lateDates.some(d => this.isSameDate(d, date))) return 'late';
  //   if (this.upcomingHolidays.some(d => this.isSameDate(d, date))) return 'upcoming';
  //   if ((isSaturday && !isFirstSaturday) || isSunday) return 'weekend';

  //   return 'none';
  // }

  // isSameDate(d1: Date, d2: Date) {
  //   return d1.getFullYear() === d2.getFullYear() &&
  //          d1.getMonth() === d2.getMonth() &&
  //          d1.getDate() === d2.getDate();
  // }
  // 1. Track the currently viewed month
  viewDate: Date = new Date();
  calendarDays: any[] = [];
  currentmonth:string ='';
  late:string ='';
  presentDates: Date[] = [];
absentDates: Date[] = [];
lateDates: Date[] = [];
// viewDate: Date = new Date();        // current displayed month
// calendarDays: any[] = [];           // array of dates to render
attendanceMap: { [key: string]: string } = {};

  // Mock Data (In a real app, call your API in changeMonth)
  // presentDates = [new Date(2026, 2, 3), new Date(2026, 2, 7)];
  // lateDates = [new Date(2026, 2, 2), new Date(2026, 2, 5)];

  ngOnInit() {
    this.getcalendardata();
    // this.generateCalendar();
    this. getattendancelatedata();
    setTimeout(() => {

    }, );
  }
  getMonthDateRange() {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0); // last day of month

    return {
      start: this.formatDate(startDate),
      end: this.formatDate(endDate)
    };
  }
  getcalendardata(){
    debugger;
    const queryName = 'mobile/getAttendanceData';
      let employeeId=localStorage.getItem('Empid');
      let CompanyId=localStorage.getItem('CompanyId');
      const { start, end } = this.getMonthDateRange();
      try {
        // Call API
        // const response: any = await this.apiService.login(logindetail, queryName);
        this.apiService.attendancereport( queryName,employeeId??"",CompanyId??"",start,end).subscribe((response)=>{
          console.log(response);
          const data = response[0]?.data || [];
          this.presentDates = [];
          this.absentDates = [];
          this.lateDates = [];
          this.attendanceMap = {};
          data.forEach((item: any) => {
            const date = new Date(item.DocDate); // convert API date to Date object
            // this.attendanceMap[this.formatDate(date)] = item.Nature;

            // Push into separate lists
            if (item.Nature === 'Present') this.presentDates.push(date);
            else if (item.Nature === 'Absent') this.absentDates.push(date);
            else if (item.Nature === 'Late') this.lateDates.push(date);
            console.log(this.presentDates);
            console.log(this.absentDates);
            console.log(this.lateDates);
          });
          setTimeout(() => {
            this.generateCalendar();
            this.cdr.detectChanges(); // notify Angular
          }, 0);
          this.generateCalendar();
        });
      }
      catch (error) {
        console.error('calendar error:', error);
        // this.showError('Something went wrong. Please try again.');
      }


  }
  formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);

    return `${year}-${month}-${day}`; // yyyy-MM-dd
  }

  // 2. Navigation Logic
  changeMonth(offset: number) {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + offset, 1);
    this.generateCalendar();
    // fetchAttendanceData(this.viewDate); // Call your API here
  }

  generateCalendar() {
    debugger;
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    // Determine the start of the grid (Monday of the first week)
    const startDayOffset = firstDay.getDay() === 0 ? -6 : 1 - firstDay.getDay();
    const days = [];
    for (let i = startDayOffset; i < startDayOffset + 42; i++) {
      const date = new Date(year, month, i);
    let status = 'none'; // default
    // mark weekends
    if (date.getDay() === 0 || date.getDay() === 6) status = 'weekend';
    // mark attendance if not weekend
    if (!['weekend'].includes(status)) {
      if (this.presentDates.some(d => this.isSameDate(d, date))) status = 'present';
      else if (this.lateDates.some(d => this.isSameDate(d, date))) status = 'late';
      else if (this.absentDates.some(d => this.isSameDate(d, date))) status = 'absent';
      else status = 'none'; // absent or no data
    }
    days.push({
      date,
      isCurrentMonth: date.getMonth() === month,
      isToday: this.isSameDate(date, new Date()),
      status
    });
   }
  this.calendarDays = days;
  //  debugger;
   console.log(this.calendarDays);
  }

  getDayStatus(date: Date): string {
    if (this.presentDates.some(d => this.isSameDate(d, date))) return 'present';
    if (this.lateDates.some(d => this.isSameDate(d, date))) return 'late';
    if (date.getDay() === 0 || date.getDay() === 6) return 'weekend';
    return 'none';
  }

  isSameDate(d1: Date, d2: Date) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }
  attendancereprt(){
    this.router.navigate(['app/attendancereport']);
  }
  goprofile(){
    this.router.navigate(['app/profile']);
  }
  getattendancelatedata(){
      const queryName = 'mobile/getattendancelatedata';
      let employeeId=localStorage.getItem('Empid');
      let CompanyId=localStorage.getItem('CompanyId');
      try {
        // Call API
        // const response: any = await this.apiService.login(logindetail, queryName);
        this.apiService.detail( queryName,employeeId??"",CompanyId??"").subscribe((response)=>{
          console.log(response);
          setTimeout(() => {
            const data = response[0]?.data?.[0];
            this.currentmonth = data?.CurrentMonthYear || '';
            this.late = data?.LateByFormatted || '';
          });
          this.cdr.detectChanges();
        });
      }
      catch (error) {
        console.error('Login error:', error);
        // this.showError('Something went wrong. Please try again.');
      }
  }
  async saveAttendance(type: string) {
    await this.getCurrentLocation();

    const now = new Date();

    const curdate = formatDate(now, 'yyyy-MM-dd', 'en-US');
    const formattedTime = formatDate(now, 'HH:mm:ss', 'en-US');

    console.log(curdate);
    console.log('Formatted time:', formattedTime);
    console.log(`${curdate} ${formattedTime}`);

    const deviceId = localStorage.getItem('deviceId');
    let EmployeeId=localStorage.getItem('Empid');
    let CompanyId=localStorage.getItem('CompanyId');

    if (!this.latitude || !this.longitude) {
      alert('Please Enable Your Location');
      await this.getCurrentLocation();
      return;
    }

    const header = [{
      CompanyId: CompanyId,
      EmployeeId: EmployeeId,
      PunchTime: `${curdate} ${formattedTime}`,
      DeviceId: deviceId || '',
      In_Out: type,
      DeviceType: 'web',
      Longitude: this.longitude,
      Latitude: this.latitude
    }];

    const payload = {
      DatasetSave: {
        t_employee_punch: header
      }
    };

    console.log('JSON:', JSON.stringify(payload));

    this.attendance(payload);
  }

  // 📍 Get Location
  getCurrentLocation(): Promise<void> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude.toString();
          this.longitude = position.coords.longitude.toString();
          resolve();
        },
        (error) => {
          console.error(error);
          resolve();
        }
      );
    });
  }
  attendance(data: any) {
    console.log('Sending to API:', data);
    const Queryname = 'mobile/employeepost';
    let EmployeeId=localStorage.getItem('Empid');
    let CompanyId=localStorage.getItem('CompanyId');
    try {
      // Call API
      // const response: any = await this.apiService.login(logindetail, queryName);
    //   this.apiService.postLeave( Queryname,data,EmployeeId??"",CompanyId??"").subscribe((response)=>{
    //     console.log(response);
    //     const message = response?['message'] || 'No message received';

    //     // ✅ Show popup
    //     this.popupMessage = message;
    //     this.showPopup = true;
    //   });
    this.apiService
  .postLeave(Queryname, data, EmployeeId ?? "", CompanyId ?? "")
  .subscribe({
    next: (response: any) => {
      console.log(response);

      const message = response?.message || response?.[0]?.message || 'No message received';
      this.popupType = 'success';
      this.popupMessage = message;
      this.showPopup = true;
      console.log('Popup status:', this.showPopup);
      this.cdr.detectChanges();
    },

    error: () => {

      this.popupType = 'error';
      this.popupMessage = 'Something went wrong. Please try again.';
      this.showPopup = true;
      this.cdr.detectChanges();
    }
  });
     }
    catch (error) {
      this.popupMessage = 'Something went wrong. Please try again.';
      this.showPopup = true;
      console.error('Login error:', error);
      // this.showError('Something went wrong. Please try again.');
    }
  }
  closePopup() {
    this.showPopup = false;
  }
}
