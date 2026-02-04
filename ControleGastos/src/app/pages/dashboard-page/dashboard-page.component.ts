import { Component } from '@angular/core';
import { ScreenBaseComponent } from "../../shared/screen-base/screen-base.component";
import { DashboardComponent } from "../../dashboard/dashboard.component";

@Component({
  selector: 'app-dashboard-page',
  imports: [ScreenBaseComponent, DashboardComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent {

}
