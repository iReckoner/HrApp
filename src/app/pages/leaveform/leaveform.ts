import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../Services/apiservice';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-leaveform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './leaveform.html',
  styleUrl: './leaveform.css'
})
export class Leaveform implements OnInit {

  constructor(private apiService: ApiService, private http: HttpClient) { }

  private fb = inject(FormBuilder);
  private location = inject(Location);
  private router = inject(Router);

  disablePartialOptions: boolean = false;

  employeeId: string = '';
  employeeName: string = '';
  totalDaysDisplay: string = 'Total Days';
  leaveForm!: FormGroup;

  alldetails: any[] = [];
  loadingLeaveTypes: boolean = false;

  ngOnInit() {
    this.employeeId = localStorage.getItem('Empid') || '';
    this.employeeName = localStorage.getItem('EmpName') || '';

    this.initForm();
    this.leavetypedata();
  }

  initForm() {
    this.leaveForm = this.fb.group({
      employeeId: [{ value: this.employeeId, disabled: true }],
      employeeName: [{ value: this.employeeName, disabled: true }],
      leaveType: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      dayType: ['Fullday'],
      reason: ['', Validators.required]
    });

    this.leaveForm.get('fromDate')?.valueChanges.subscribe(() => {
      this.calculateTotalDays();
    });

    this.leaveForm.get('toDate')?.valueChanges.subscribe(() => {
      this.calculateTotalDays();
    });
  }

  calculateTotalDays() {
    const from = this.leaveForm.get('fromDate')?.value;
    const to = this.leaveForm.get('toDate')?.value;
    const dayType = this.leaveForm.get('dayType')?.value;

    if (!from || !to) {
      this.totalDaysDisplay = 'Total Days';
      this.disablePartialOptions = false;
      return;
    }

    const d1 = new Date(from);
    const d2 = new Date(to);

    if (d2 < d1) {
      this.totalDaysDisplay = 'Invalid date range';
      this.disablePartialOptions = false;
      return;
    }

    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    let result = diffDays > 0 ? diffDays : 0;

    this.disablePartialOptions = result > 1;

    if (this.disablePartialOptions && (dayType === 'Halfday' || dayType === 'Shortday')) {
      this.leaveForm.get('dayType')?.setValue('Fullday', { emitEvent: false });
    }

    if (result === 1 && dayType === 'Halfday') {
      this.totalDaysDisplay = '0.5 Day';
    } else if (result === 1 && dayType === 'Shortday') {
      this.totalDaysDisplay = '0.25 Day';
    } else {
      this.totalDaysDisplay = result === 0 ? '0' : `${result} Days`;
    }
  }

  //making object in the format required by the API
  onSubmit() {
    if (!this.leaveForm.valid) {
      this.leaveForm.markAllAsTouched();
      return;
    }

    const raw = this.leaveForm.getRawValue();
    const companyId = localStorage.getItem('CompanyId') || '00000082';
    const employeeId = Number(raw.employeeId) || 0;

    // current date in YYYY-MM-DD format
    const curdate = new Date().toISOString().slice(0, 10);

    // HEADER object
    const headerObject = {
      CompanyId: companyId,
      DocId: "30000082",
      DocType: "0000",
      DocNo: "0",
      DocSlNo: "",
      DocDate: `${curdate} 00:00:00`,
      Status: "1",
      CreatedBy: 1,
      CreatedDate: `${curdate} 00:00:00`,
      Modified_By: 1,
      Modified_Date: ""
    };

    // determine per-day period
    const dayType = raw.dayType || 'Fullday';
    let perDayPeriod = 1;
    if (dayType === 'Halfday') perDayPeriod = 0.5;
    if (dayType === 'Shortday') perDayPeriod = 0.25;

    // build DETAIL entries
    const from = new Date(raw.fromDate);
    const to = new Date(raw.toDate);
    const detailList: any[] = [];

    let cur = new Date(from);
    let seq = 1;

    while (cur <= to) {
      const docStartDate = cur.toISOString().slice(0, 10);

      detailList.push({
        CompanyId: companyId,
        DocId: "30000082",
        DocType: "0000",
        DocNo: "0",
        SeqNo: seq,
        EmpId: employeeId,
        DocNature: raw.leaveType,
        DocStartDate: `${docStartDate} 00:00:00`,
        DocPeriod: perDayPeriod,
        SeqStaus: "0",
        Remarks: raw.reason || ""
      });

      seq++;
      cur.setDate(cur.getDate() + 1);
    }

    const payload = {
      DatasetSave: {
        HEADER: [headerObject],
        DETAIL: detailList
      }
    };

    console.log('Payload to send:', JSON.stringify(payload, null, 2));
    console.log('Payload to send:', payload);

    // API call
    const profileId = 'staging';
    const url = `${this.apiService.getApiUrl()}/mobile/LeaveApply?ProfileId=${profileId}&EmployeeId=${employeeId}&CompanyId=${companyId}&DocumentAction=1&DocGen=1`;
    const deviceId = localStorage.getItem('deviceId') ?? '';
    const headers = new HttpHeaders({
      'DeviceId': deviceId,
      'Content-Type': 'application/json'
    });

    this.http.post(url, payload, { headers }).subscribe({
      next: (res) => {
        console.log('Leave apply response', res);
        // navigate back or give feedback
        this.location.back();
      },
      error: (err) => {
        console.error('Leave apply error', err);
      }
    });
  }
 
  //back navigation button in form page
  gotoleave() {
    this.location.back();
  }
  //leave type dropdown data fetching from API and mapping to form
  leavetypedata() {
    const queryName = 'mobile/getLeaveType';
    let employeeId = localStorage.getItem('Empid');
    let CompanyId = localStorage.getItem('CompanyId');

    this.loadingLeaveTypes = true;
    this.apiService.detail(queryName, employeeId ?? "", CompanyId ?? "").subscribe({
      next: (response) => {
        const apiData = response?.[0]?.data || [];
        this.alldetails = apiData;
        this.loadingLeaveTypes = false;
        // ensure a clean selection if previously empty
        this.leaveForm.get('leaveType')?.setValue(this.alldetails.length ? this.leaveForm.get('leaveType')?.value || '' : '');
        console.log("Mapped Leave Types:", this.alldetails);
      },
      error: (err) => {
        console.error('Leave type fetch error', err);
        this.alldetails = [];
        this.loadingLeaveTypes = false;
      }
    });
  }

  trackByLeaveId(index: number, item: any) {
    return item?.LeaveId ?? index;
  }

}
