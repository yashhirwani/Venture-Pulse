import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Core Layout
import { AppLayoutComponent } from './core/app-layout/app-layout.component';

// Auth Components
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';

// Workspace Components
import { DashboardComponent } from './workspace/dashboard/dashboard.component';
import { NewAnalysisComponent } from './workspace/new-analysis/new-analysis.component';
import { ProcessingComponent } from './workspace/processing/processing.component';
import { ReportComponent } from './workspace/report/report.component';
import { HistoryComponent } from './workspace/history/history.component';
import { LandingComponent } from './public/landing/landing.component';


const routes: Routes = [
  // 1. PUBLIC ROUTES (No Sidebar/Navbar)
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  // 2. PROTECTED WORKSPACE ROUTES (Wrapped in AppLayout)
  {
    path: 'workspace',
    component: AppLayoutComponent, // This parent holds the Sidebar & Navbar
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'new-analysis', component: NewAnalysisComponent },
      { path: 'processing/:id', component: ProcessingComponent },
      { path: 'report/:id', component: ReportComponent },
      { path: 'history', component: HistoryComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // 3. GLOBAL REDIRECTS
  { path: 'dashboard', redirectTo: 'workspace/dashboard', pathMatch: 'full' },
  { path: '', component: LandingComponent },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }