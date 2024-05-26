
import { errorsChildrenRoutes } from 'src/app/components/errors/errors-children-routes';
import { BanksListComponent } from './banks-list/banks-list.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';


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
  // Bank Details
  {
    path: 'Details/:id',
    component: BankDetailsComponent,
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
