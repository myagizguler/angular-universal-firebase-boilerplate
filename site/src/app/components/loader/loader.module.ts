import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader.component';
import { LoaderService } from './loader.service';
import { MatProgressBarModule } from '@angular/material';

@NgModule({
	declarations: [LoaderComponent],
	imports: [
		CommonModule,
		MatProgressBarModule
	],
	providers: [
		LoaderService,
	],
	exports: [LoaderComponent]
})
export class LoaderModule { }
