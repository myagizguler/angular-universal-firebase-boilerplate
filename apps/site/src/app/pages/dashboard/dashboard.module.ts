import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SplitDashboard } from './split-dashboard.service';
import { WidgetModule } from 'open-dashboard';
import { FLWidgetsModule } from '../../providers/fl-widgets';

@NgModule({

	declarations: [
		DashboardComponent,
	],
	imports: [
		CommonModule,
		DashboardRoutingModule,
		WidgetModule
	],
	providers: [
		FLWidgetsModule,
		SplitDashboard
	],
	exports: [DashboardComponent]
})
export class DashboardModule { }
