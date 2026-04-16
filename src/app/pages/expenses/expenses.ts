import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../Services/apiservice';
@Component({
  selector: 'app-expenses',
  imports: [],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})
export class Expenses {
  alldetails:[]=[];
  constructor(private router: Router,private apiService:ApiService) {}
  goexpensehistory(){
    debugger;
    this.router.navigate(['app/expensehistory']);
  }
  expensedata(){
    const queryName = 'mobile/getrecentexpenseHistory';
    let employeeId=localStorage.getItem('Empid');
    let CompanyId=localStorage.getItem('CompanyId');
    try {
      // Call API
      // const response: any = await this.apiService.login(logindetail, queryName);
      this.apiService.detail( queryName,employeeId??"",CompanyId??"").subscribe((response)=>{
        console.log(response);
        const apiData = response?.[0]?.data || [];
        this.alldetails= apiData[0]?.[0];
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
  getexpensedetail(){
    const employeeId=localStorage.getItem('Empid');
    let CompanyId=localStorage.getItem('CompanyId');
    const queryName='mobile/getexpenseHistory';
    try{
    this.apiService.detail(queryName,CompanyId??'',employeeId??'')
    }
    catch{

    }
  }
}
