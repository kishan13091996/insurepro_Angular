import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CustomersComponent } from './features/customers/customers.component';
import { PoliciesComponent } from './features/policies/policies.component';
import { ClaimsComponent } from './features/claims/claims.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { CustomerRegistrationComponent } from './features/customer-registration/customer-registration.component';
import { LoginComponent } from './features/login/login.component';
import { authGuard } from './guard/auth-guard';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'login',component:LoginComponent},
    {path:'dashboard',component:DashboardComponent,canActivate:[authGuard]},
    {path:'customers',component:CustomersComponent,canActivate:[authGuard]},
    {path:'policies',component:PoliciesComponent,canActivate:[authGuard]},
    {path:'claims',component:ClaimsComponent,canActivate:[authGuard]},
    {path:'customer-registration',component:CustomerRegistrationComponent,canActivate:[authGuard]},
    {path:'**',component:NotFoundComponent},
];
