
import { errorsChildrenRoutes } from 'src/app/components/errors/errors-children-routes';
import { FaqsListComponent } from './faqs-list/faqs-list.component';
import { AddEditFaqComponent } from './add-edit-faq/add-edit-faq.component';


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
  {
    path: 'AddEditFaq',
    component: AddEditFaqComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.FAQs.AddEdit',
      title: 'AddEditFaq'
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
