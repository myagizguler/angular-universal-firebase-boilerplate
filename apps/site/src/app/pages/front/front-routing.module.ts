import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FrontComponent } from './front.component';

const routes: Routes = [{
	path: '',
	component: FrontComponent,
	children: [
		{
			path: '',
			loadChildren: '../front/home/home.module#HomeModule'
		}
	]
}];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class FrontRoutingModule { }
