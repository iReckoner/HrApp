import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Layout } from './pages/layout/layout';
import { Leave } from './pages/leave/leave';
import { AttendanceReport } from './pages/attendance-report/attendance-report';
import { Leavehistory } from './pages/leavehistory/leavehistory';
import { Expenses } from './pages/expenses/expenses';
import { Expenseshistory } from './pages/expenseshistory/expenseshistory';
import { Salary } from './pages/salary/salary';
import { Profile } from './pages/profile/profile';
import { Leaveform } from './pages/leaveform/leaveform';
// export const routes: Routes = [];
export const routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'as const },
  { path: 'login', component: Login },
  {
    path: 'app',
    component: Layout,
    // canActivate: [AuthGuard],
    children: [
      { path: 'home', component: Home },
      {path:'leave',component: Leave},
      {path:'attendancereport',component :AttendanceReport},
      {
        path:'leavehistory',component:Leavehistory
      },
      {
        path:'expense',component:Expenses
      },
      {
        path:'expensehistory',component:Expenseshistory
      },
      {
        path:'salary',component:Salary
      },
      {
        path:'profile',component:Profile
      },
      {
        path:'leaveform',component:Leaveform
      },

    ]
  },
];
