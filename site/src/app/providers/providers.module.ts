import { NgModule } from '@angular/core';
import { DataModule } from './data/data.module';
import { LanguageModule } from './language/language.module';

@NgModule({
	imports: [
		LanguageModule,
		DataModule,
	]
})
export class ProvidersModule { }
