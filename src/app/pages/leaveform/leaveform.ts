import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../Services/apiservice';

@Component({
  selector: 'app-leaveform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './leaveform.html',
  styleUrl: './leaveform.css'
})
export class Leaveform implements OnInit {

  constructor(private apiService: ApiService) { }

  private fb = inject(FormBuilder);
  private location = inject(Location);
  private router = inject(Router);

  disablePartialOptions: boolean = false;

  employeeId: string = '';
  employeeName: string = '';
  totalDaysDisplay: string = 'Total Days';
  leaveForm!: FormGroup;

  alldetails: any[] = [];

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

  //Old submit function, 
  // onSubmit() {
  //   if (this.leaveForm.valid) {
  //     const payload = {
  //       ...this.leaveForm.getRawValue(),
  //       totalDays: this.totalDaysDisplay
  //     };

  //     console.log('Submitted Data:', payload);
  //     // API call here
  //   } else {
  //     this.leaveForm.markAllAsTouched();
  //   }
  // }

  //making object in the format required by the API
  onSubmit() {
    if (!this.leaveForm.valid) {
      this.leaveForm.markAllAsTouched();
      return;
    }

    const raw = this.leaveForm.getRawValue();
    const companyId = localStorage.getItem('CompanyId') || '00000082';
    const employeeId = Number(raw.employeeId) || 0;
    //const docId = '30000082';
    //const docType = '0000';
    //const docNo = 0;

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

    // console.log('Payload to send:', JSON.stringify(payload, null, 2));
    console.log('Payload to send:', payload);

    // API call
    // this.apiService.save('mobile/saveLeave', payload)
    //   .subscribe(res => console.log('Save response', res));
  }

  //##########################################################



  //back navigation button in form page
  gotoleave() {
    this.location.back();
  }
  //API call to get leave types and map them to the dropdown
  leavetypedata() {
    const queryName = 'mobile/getLeaveType';
    let employeeId = localStorage.getItem('Empid');
    let CompanyId = localStorage.getItem('CompanyId');

    this.apiService.detail(queryName, employeeId ?? "", CompanyId ?? "").subscribe((response) => {
      console.log("API RESPONSE:", response);
      console.log("device id:", localStorage.getItem('deviceId'));
      const apiData = response?.[0]?.data || [];
      this.alldetails = apiData;
      
      console.log("Mapped Leave Types:", this.alldetails);
    });
  }
}