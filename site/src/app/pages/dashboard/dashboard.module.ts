import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { FlamelinkWidgets } from './flamelink-widgets.service';
import { SplitDashboard } from './split-dashboard.service';
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
	providers: [
		FlamelinkWidgets,
		SplitDashboard
	],
	exports: [DashboardComponent]
})
export class DashboardModule { }
