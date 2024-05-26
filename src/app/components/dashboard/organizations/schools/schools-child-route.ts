
import { errorsChildrenRoutes } from 'src/app/components/errors/errors-children-routes';
import { SchoolsListComponent } from './schools-list/schools-list.component';
import { SchoolDetailsComponent } from './school-details/school-details.component';


export const SchoolsChildrenRoutes: any[] = [
  { path: '', redirectTo: 'List', pathMatch: 'full' },
  // Schools List
  {
    path: 'List',
    component: SchoolsListComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Schools.List',
      title: 'SchoolsList'
    },
    pathMatch: 'full'
  },
   // School Details
   {
    path: 'Details/:id',
    component: SchoolDetailsComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.details.List',
      title: 'details'
    },
    pathMatch: 'full'
  },

  // Errors
  {
    path: ':lang/Errors',
    loadComponent: () =>
      import('../../../errors/errors.component').then(
        (c) => c.ErrorsComponent
      ),
    children: errorsChildrenRoutes
  },
  {
    path: 'Errors',
    loadComponent: () =>
      import('../../../errors/errors.component').then(
        (c) => c.ErrorsComponent
      ),
    children: errorsChildrenRoutes
  },
  { path: '**', redirectTo: '/en/Errors/404' } // Redirect all unknown paths to '/Errors'
];
