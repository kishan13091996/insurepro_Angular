import { Component, inject } from '@angular/core';
import { AuthStateServiceService } from '../../services/auth-state-service.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  public authState = inject(AuthStateServiceService);
}
