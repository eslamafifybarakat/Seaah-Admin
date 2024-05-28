import { Routes } from '@angular/router';
// Components

// TS Files for child routes
import { dashBoardChildrenRoutes } from './components/dashboard/dashboard-children-routes';
import { errorsChildrenRoutes } from './components/errors/errors-children-routes';
import { authChildrenRoutes } from './components/auth/auth-children-routes';
//Services
import { AuthGuard } from './services/authentication/guards/auth.guard';


export const appRoutes: Routes = [
  { path: '', redirectTo: '/en/Auth/Login', pathMatch: 'full' },
  // Authentication
  {
    path: 'Auth',
    canActivate: [AuthGuard], // Apply the guard here
    loadComponent: () =>
      import('./components/auth/auth.component').then(
        (c) => c.AuthComponent
      ),
    children: authChildrenRoutes
  },
  {
    path: ':lang/Auth',
    canActivate: [AuthGuard], // Apply the guard here
    loadComponent: () =>
      import('./components/auth/auth.component').then(
        (c) => c.AuthComponent
      ),
    children: authChildrenRoutes
  },

  // Dashboard
  {
    path: 'Dashboard',
    // canActivate: [AuthGuard], // Apply the guard here
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
    children: dashBoardChildrenRoutes
  },
  {
    path: ':lang/Dashboard',
    // canActivate: [AuthGuard], // Apply the guard here
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
    children: dashBoardChildrenRoutes
  },

  // Errors
  {
    path: ':lang/Errors',
    loadComponent: () =>
      import('./components/errors/errors.component').then(
        (c) => c.ErrorsComponent
      ),
    children: errorsChildrenRoutes
  },
  {
    path: 'Errors',
    loadComponent: () =>
      import('./components/errors/errors.component').then(
        (c) => c.ErrorsComponent
      ),
    children: errorsChildrenRoutes
  },
  { path: '**', redirectTo: '/en/Errors/404' } // Redirect all unknown paths to '/Errors'
];
