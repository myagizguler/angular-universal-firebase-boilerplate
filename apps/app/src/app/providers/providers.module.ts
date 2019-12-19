import { NgModule } from '@angular/core';
import { DataModule } from './data/data.module';
import { LanguageModule } from './language/language.module';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
	imports: [
		LanguageModule,
		DataModule,
		MarkdownModule.forRoot(),

	]
})
export class ProvidersModule { }
