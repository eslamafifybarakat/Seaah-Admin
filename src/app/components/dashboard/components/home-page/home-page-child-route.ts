import { errorsChildrenRoutes } from 'src/app/components/errors/errors-children-routes';
import { FAQsChildrenRoutes } from './faqs/faqs-child-route';
import { BlogsChildrenRoutes } from './blogs/blogs-child-route';


export const HomePageChildrenRoutes: any[] = [
  { path: '', redirectTo: 'FAQs', pathMatch: 'full' },
  // FAQs
  {
    path: 'FAQs',
    data: {
      permission: 'Pages.FAQs.List',
      title: 'FAQs'
    },
    loadComponent: () =>
      import('./faqs/faqs.component').then(
        (c) => c.FaqsComponent
      ),
    children: FAQsChildrenRoutes
  },
  // Blogs
  {
    path: 'Blogs',
    data: {
      permission: 'Pages.Blogs.List',
      title: 'Blogs'
    },
    loadComponent: () =>
      import('./blogs/blogs.component').then(
        (c) => c.BlogsComponent
      ),
    children: BlogsChildrenRoutes
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

