import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { AuthService } from './services/auth.service';
import { LoadingService } from './services/loading.service';
import { AuthStateServiceService } from './services/auth-state-service.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent,SidebarComponent,FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  authService = inject(AuthService);
  authState = inject(AuthStateServiceService);
 userName = this.authService.getRoleName();
 route = inject(Router);
 loadingService = inject(LoadingService);

 onLogoutmsg(userName:string){
  if(! confirm("Hi "+ userName +" ,Are you sure about the LogOut")){
    return;
  }
  this.authState.clearUser();
  this.authService.logOut();
  this.route.navigate(['/login'])
 }

}
