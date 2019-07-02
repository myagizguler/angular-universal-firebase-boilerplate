import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontRoutingModule } from './front-routing.module';
import { FrontComponent } from './front.component';
import { BootstrapDirectionComponent } from '../../providers/language/bootstrap-direction.component';
import { LoaderModule } from '../../components/loader/loader.module';

@NgModule({
	declarations: [
		FrontComponent,
		BootstrapDirectionComponent
	],
	imports: [
		CommonModule,
		FrontRoutingModule,
		LoaderModule
	],
	exports: [FrontComponent]
})
export class FrontModule { }
