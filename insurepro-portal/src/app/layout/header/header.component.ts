import { Component, inject, input, output } from '@angular/core';
import { AuthStateServiceService } from '../../services/auth-state-service.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
   logout = output<string>();
   public authState = inject(AuthStateServiceService);

  onLogout() {
    this.logout.emit("Kishan");
  }

}
