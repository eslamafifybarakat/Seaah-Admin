
import { errorsChildrenRoutes } from 'src/app/components/errors/errors-children-routes';
import { BanksListComponent } from './banks-list/banks-list.component';


export const BanksChildrenRoutes: any[] = [
  { path: '', redirectTo: 'List', pathMatch: 'full' },
  // Banks List
  {
    path: 'List',
    component: BanksListComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Banks.List',
      title: 'BanksList'
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
