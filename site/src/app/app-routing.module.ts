import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: './pages/home/home.module#HomeModule'
      }
    ]
  },
  // The below route is required to run firebase serve locally.
  {
    path: ':projectId/us-central1/ssr',
    redirectTo: '',
    pathMatch: 'prefix'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
