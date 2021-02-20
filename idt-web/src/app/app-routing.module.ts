import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorPageComponent } from './shared/components/error-page/error-page.component';
import { RegistrationGuard } from './services/guards/registration.guard';
import { LoggedInGuard } from './services/guards/logged-in.guard';
import { AdminGuard } from './services/guards/admin.guard';
import { AuthGuard } from './services/guards/auth.guard';

const routes: Routes = [
  {
    path:  'login',
    loadChildren: './pages/login/login.module#LoginModule',
    canActivate: [LoggedInGuard]
  },
  {
    path: 'feed',
    loadChildren: './pages/feed/feed.module#FeedModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'cases',
    loadChildren: './pages/cases/cases.module#CasesModule',
  },
  {
    path: 'dashboard',
    loadChildren: './pages/dashboard-new/dashboard-new.module#DashboardNewModule',
  },
  {
    path: 'companies',
    loadChildren: './pages/companies/companies.module#CompaniesModule',
  },
  {
    path:  'auth/validate/:hash',
    loadChildren: './pages/registration/registration.module#RegistrationModule',
    canActivate: [RegistrationGuard]
  },
  {
    path: 'admin',
    loadChildren: './pages/admin-panel/admin.module#AdminModule',
    canActivate: [AdminGuard],
  },
  {
    path:  'search',
    loadChildren: './pages/search/search.module#SearchModule',
  },
  {
    path:  'about',
    loadChildren: './pages/about-idt/about-idt.module#AboutIdtModule',
  },
  {
    path:  'subscription',
    loadChildren: './pages/subscription/subscription.module#SubscriptionModule'
  },
  {
    path:  'imprint',
    loadChildren: './pages/imprint/imprint.module#ImprintModule'
  },
  {
    path:  'privacy',
    loadChildren: './pages/privacy/privacy.module#PrivacyModule'
  },
  {
    path:  'profile',
    loadChildren: './pages/user-profile/user.module#UserModule',
    canActivate: [AuthGuard]
  },
  {
    path:  '',
    loadChildren: './pages/dashboard/dashboard.module#DashboardModule'
  },
  {
    path: '**',
    component: ErrorPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    onSameUrlNavigation: 'reload',
    scrollOffset: [0, 100],
    anchorScrolling: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
