import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '../environments/environment';

let routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: './pages/home/home.module#HomeModule'
      }
    ]
  },
];

if (environment.production) {
  // Required to run fire:serve locally.
  routes = [
    {
      path: '',
      children: routes
    },
    {
      path: ':projectId/us-central1/ssr',
      redirectTo: '',
      pathMatch: 'full'
    },
    {
      path: ':projectId/us-central1/ssr/:route',
      redirectTo: ':route',
      pathMatch: 'full'
    },
  ];
}


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
