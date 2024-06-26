// Services
import { PermissionGuard } from '../../services/authentication/guards/permission.guard';
// Components
import { StatisticsComponent } from "./../dashboard/statistics/statistics.component";
// TS Files
import { HomePageChildrenRoutes } from './components/home-page/home-page-child-route';
import { OrganizationshildrenRoutes } from './organizations/organizations-child-route';
import { errorsChildrenRoutes } from '../errors/errors-children-routes';

export const dashBoardChildrenRoutes: any[] = [
  { path: '', redirectTo: 'Statistics', pathMatch: 'full' },
  // Statistics
  {
    path: 'Statistics',
    component: StatisticsComponent,
    pathMatch: 'full'
  },
  // Organizations
  {
    path: 'Organizations',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Organizations',
      title: 'Organizations'
    },
    loadComponent: () =>
      import('./../dashboard/organizations/organizations.component').then(
        (c) => c.OrganizationsComponent
      ),
    children: OrganizationshildrenRoutes
  },
   // Home Page
   {
    path: 'Home',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Home',
      title: 'Home'
    },
    loadComponent: () =>
      import('./../dashboard/components/home-page/home-page.component').then(
        (c) => c.HomePageComponent
      ),
    children: HomePageChildrenRoutes
  },

  // Errors
  {
    path: ':lang/Errors',
    loadComponent: () =>
      import('./../../components/errors/errors.component').then(
        (c) => c.ErrorsComponent
      ),
    children: errorsChildrenRoutes
  },
  {
    path: 'Errors',
    loadComponent: () =>
      import('./../../components/errors/errors.component').then(
        (c) => c.ErrorsComponent
      ),
    children: errorsChildrenRoutes
  },
  { path: '**', redirectTo: '/en/Errors/404' } // Redirect all unknown paths to '/Errors'
];
