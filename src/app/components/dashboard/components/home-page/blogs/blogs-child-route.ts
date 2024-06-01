
import { errorsChildrenRoutes } from 'src/app/components/errors/errors-children-routes';
import { BlogsListComponent } from './blogs-list/blogs-list.component';


export const BlogsChildrenRoutes: any[] = [
  { path: '', redirectTo: 'List', pathMatch: 'full' },
  // Blogs List
  {
    path: 'List',
    component: BlogsListComponent,
    data: {
      permission: 'Pages.Blogs.List',
      title: 'BlogsList'
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
