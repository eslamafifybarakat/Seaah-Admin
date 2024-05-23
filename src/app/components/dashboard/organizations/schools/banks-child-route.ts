
import { errorsChildrenRoutes } from 'src/app/components/errors/errors-children-routes';
import { SchoolsListComponent } from './schools-list/schools-list.component';


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

  // Errors
  {
    path: ':lang/Errors',
    loadComponent: () =>
      import('./../../../../components/errors/errors.component').then(
        (c) => c.ErrorsComponent
      ),
    children: errorsChildrenRoutes
  },
  {
    path: 'Errors',
    loadComponent: () =>
      import('./../../../../components/errors/errors.component').then(
        (c) => c.ErrorsComponent
      ),
    children: errorsChildrenRoutes
  },
  { path: '**', redirectTo: '/en/Errors/404' } // Redirect all unknown paths to '/Errors'
];
