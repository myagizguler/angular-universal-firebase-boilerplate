import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { WidgetModule } from 'open-dashboard';

@NgModule({

	declarations: [
		DashboardComponent,
	],
	imports: [
		CommonModule,
		DashboardRoutingModule,
		WidgetModule
	],
	exports: [DashboardComponent]
})
export class DashboardModule { }
