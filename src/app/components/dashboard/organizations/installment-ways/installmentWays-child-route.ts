
import { errorsChildrenRoutes } from 'src/app/components/errors/errors-children-routes';
import { InstallmentWaysListComponent } from './installment-ways-list/installment-ways-list.component';


export const InstallmentWaysChildrenRoutes: any[] = [
  { path: '', redirectTo: 'List', pathMatch: 'full' },
  // Installment Ways List
  {
    path: 'List',
    component: InstallmentWaysListComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Installment.List',
      title: 'InstallmentWaysList'
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
