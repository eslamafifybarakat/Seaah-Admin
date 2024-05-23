import { errorsChildrenRoutes } from '../../errors/errors-children-routes';
import { SchoolsChildrenRoutes } from './schools/banks-child-route';
import { BanksChildrenRoutes } from './banks/banks-child-route';


export const OrganizationshildrenRoutes: any[] = [
  { path: '', redirectTo: 'Banks', pathMatch: 'full' },
  // Banks
  {
    path: 'Banks',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Banks.List',
      title: 'Banks'
    },
    loadComponent: () =>
      import('./banks/banks.component').then(
        (c) => c.BanksComponent
      ),
    children: BanksChildrenRoutes
  },
   // Schools
   {
    path: 'Schools',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Schools.List',
      title: 'Schools'
    },
    loadComponent: () =>
      import('./schools/schools.component').then(
        (c) => c.SchoolsComponent
      ),
    children: SchoolsChildrenRoutes
  },

  // Errors
  {
    path: ':lang/Errors',
    loadComponent: () =>
      import('./../../../components/errors/errors.component').then(
        (c) => c.ErrorsComponent
      ),
    children: errorsChildrenRoutes
  },
  {
    path: 'Errors',
    loadComponent: () =>
      import('./../../../components/errors/errors.component').then(
        (c) => c.ErrorsComponent
      ),
    children: errorsChildrenRoutes
  },
  { path: '**', redirectTo: '/en/Errors/404' } // Redirect all unknown paths to '/Errors'
];

