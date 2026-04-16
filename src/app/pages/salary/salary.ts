import { Component } from '@angular/core';
import { OnInit } from '../../../../node_modules/@angular/core/types/core';
import { Router } from '@angular/router';
import { ApiService } from '../../Services/apiservice';
import { ChangeDetectorRef } from '@angular/core';
export interface SalaryEntry {
  label: string;
  amount: number;
}

@Component({
  selector: 'app-salary',
  imports: [],
  templateUrl: './salary.html',
  styleUrl: './salary.css',
})

export class Salary  implements OnInit {
  addsalary:SalaryEntry[]=[];
  deductsalary:SalaryEntry[]=[];
  sumsalary:SalaryEntry[]=[];
  totalearning:string='';
  totaldeduction:string='';
  netsalary:string='';
  currentMonth = new Date().toLocaleString('en-US', {
    month: 'long',
    year: 'numeric'
  });
   month = new Date().toLocaleString('en-US', { month: '2-digit' });
   year = new Date().getFullYear().toString() ;
   sumdetails:[]=[];
   deductdetails:[]=[];
   alldetails:[]=[];
  constructor(
    private router: Router,
    private apiService: ApiService,private cdr: ChangeDetectorRef
 ) { }
  ngOnInit(): void {
    this.month = this.month === '01'
  ? '12'
  : String(Number(this.month) - 1).padStart(2, '0');
  this.year=this.month==='01'?String(Number(this.year)-1):this.year;
  // this.currentMonth=this.month + this.year;
    this.salarydetails(this.month,this.year);

  }
  onMonthSelect(event: any) {
    const selectedValue = event.target.value;
    if (!selectedValue) return;

    const [year, month] = selectedValue.split('-');

    // Format for display (e.g., "March 2026")
    const date = new Date(parseInt(year), parseInt(month) - 1);
    this.currentMonth = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    this.salarydetails(month ,year );
  }
  salarydetails(month:string, year:string){
    const employeeId=localStorage.getItem('Empid');
    const CompanyId=localStorage.getItem('CompanyId');
    const queryname = 'mobile/getSalaryinfo';
    this.apiService.attendancereport(queryname,employeeId??"",CompanyId??"",month,year).subscribe((response)=>{
    this.alldetails = response[0].data;
    this.deductdetails=response[1].data;
    this.sumdetails=response[2].data;
    this.totalearning=response[2].data[0]['Earnings'];
    this.totaldeduction=response[2].data[0]['Deductions'];
    this.netsalary=response[2].data[0]['Netsalary'];
    this.addsalary=this.alldetails.map((item: any) => {
      return {
     label:item.CompntName,
     amount:item.amount
        };
      });
      this.deductsalary=this.deductdetails.map((item: any) => {
      return {
     label:item.CompntName,
     amount:item.amount
        };
      });
      this.cdr.detectChanges();
    })
  }
}
