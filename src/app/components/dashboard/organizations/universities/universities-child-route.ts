
import { errorsChildrenRoutes } from 'src/app/components/errors/errors-children-routes';
import { UniversitiesListComponent } from './universities-list/universities-list.component';
import { UniversityDetailsComponent } from './university-details/university-details.component';


export const UniversitiesChildrenRoutes: any[] = [
  { path: '', redirectTo: 'List', pathMatch: 'full' },
  // Universities List
  {
    path: 'List',
    component: UniversitiesListComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Banks.List',
      title: 'UniversitiesList'
    },
    pathMatch: 'full'
  },
  // University Details
  {
    path: 'Details/:id',
    component: UniversityDetailsComponent,
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
