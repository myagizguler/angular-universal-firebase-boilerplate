import { NgModule } from '@angular/core';
import { DataModule } from './data/data.module';
import { LanguageModule } from './language/language.module';
import { FLWidgetsModule } from 'fl-widgets';

@NgModule({
	imports: [
		LanguageModule,
		DataModule,
		FLWidgetsModule
	]
})
export class ProvidersModule { }
