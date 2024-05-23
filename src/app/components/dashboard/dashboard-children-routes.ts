// Services
import { PermissionGuard } from '../../services/authentication/guards/permission.guard';
// Components
import { StatisticsComponent } from "./../dashboard/statistics/statistics.component";
// TS Files
import { SchoolsChildrenRoutes } from '../dashboard/schools/schools-child-route';
import { ParentChildrenRoutes } from '../dashboard/parent/parent-child-route';

import { installmentWaysChildrenRoutes } from '../dashboard/installment-ways/installment-ways-children-routes';
import { errorsChildrenRoutes } from '../errors/errors-children-routes';
import { BankChildrenRoutes } from './banks/banks-child-route';
import { OrganizationshildrenRoutes } from './organizations/organizations-child-route';

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

  // Parents
  {
    path: 'Parent',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Client.List',
      title: 'Appointments'
    },
    loadComponent: () =>
      import('./../dashboard/parent/parent.component').then(
        (c) => c.ParentComponent
      ),
    children: ParentChildrenRoutes
  },
  // Banks
  {
    path: 'Bank',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Bank.Requests',
      title: 'Appointments'
    },
    loadComponent: () =>
      import('./../dashboard/banks/banks.component').then(
        (c) => c.BanksComponent
      ),
    children: BankChildrenRoutes
  },
  {
    path: ':lang/Parent',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Client.List',
      title: 'Appointments'
    },
    loadComponent: () =>
      import('./../dashboard/parent/parent.component').then(
        (c) => c.ParentComponent
      ),
    children: ParentChildrenRoutes
  },
  // Schools
  {
    path: 'Schools',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Schools',
      title: 'Schools'
    },
    loadComponent: () =>
      import('./../dashboard/schools/schools.component').then(
        (c) => c.SchoolsComponent
      ),
    children: SchoolsChildrenRoutes
  },
  {
    path: ':lang/Schools',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Schools',
      title: 'Schools'
    },
    loadComponent: () =>
      import('./../dashboard/schools/schools.component').then(
        (c) => c.SchoolsComponent
      ),
    children: SchoolsChildrenRoutes
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
