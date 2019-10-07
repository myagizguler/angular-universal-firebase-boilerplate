import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


@NgModule({
	imports: [RouterModule.forRoot([
		{
			path: '',
			loadChildren: './pages/dashboard/dashboard.module#DashboardModule'
		}
	])],
	exports: [RouterModule]
})
export class AppRoutingModule { }
