
import { errorsChildrenRoutes } from 'src/app/components/errors/errors-children-routes';
import { FaqsListComponent } from './faqs-list/faqs-list.component';


export const FAQsChildrenRoutes: any[] = [
  { path: '', redirectTo: 'List', pathMatch: 'full' },
  // FAQs List
  {
    path: 'List',
    component: FaqsListComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.FAQs.List',
      title: 'FAQsList'
    },
    pathMatch: 'full'
  },

  // Errors
  {
    path: ':lang/Errors',
    loadComponent: () =>
      import('./../../../../../components/errors/errors.component').then(
        (c) => c.ErrorsComponent
      ),
    children: errorsChildrenRoutes
  },
  {
    path: 'Errors',
    loadComponent: () =>
      import('./../../../../../components/errors/errors.component').then(
        (c) => c.ErrorsComponent
      ),
    children: errorsChildrenRoutes
  },
  { path: '**', redirectTo: '/en/Errors/404' } // Redirect all unknown paths to '/Errors'
];
