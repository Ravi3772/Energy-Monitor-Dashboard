import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { MetersComponent } from './pages/meters/meters';
import { LinesComponent } from './pages/lines/lines';
import { MeterDetailComponent } from './pages/meter-detail/meter-detail';
import { LineDetailComponent } from './pages/line-detail/line-detail';
import { LoginComponent } from './pages/login/login';
import { authGuard } from './guards/auth.guard';
import { loginPageGuard } from './guards/login.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loginPageGuard] },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'meters', component: MetersComponent },
      { path: 'lines', component: LinesComponent },
      { path: 'lines/:id', component: LineDetailComponent },
      { path: 'meters/:id', component: MeterDetailComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];