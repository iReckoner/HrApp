import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-layout',
  imports: [RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  constructor(private router: Router) {}
  goHome() {
    this.router.navigate(['app/home']);
  }
  goleave() {
    this.router.navigate(['app/leave']);
  }
  goexpenses() {
    this.router.navigate(['app/expense']);
  }
  goSalary() {
    this.router.navigate(['app/salary']);
  }
}
