import { NgModule } from '@angular/core';
import { DataService } from './data.service';
import { environment } from '../../../environments/environment';
import { DataToolsService } from './data-tools.service';
import { IdeasService } from './models/ideas/ideas';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { FlamelinkModule, FLContentModule, FLStorageModule, FLUsersModule, FLSettingsModule, FLSchemasModule } from 'ng-flamelink';
import { AngularFireFunctionsModule } from '@angular/fire/functions';

@NgModule({
	providers: [
		DataService,
		DataToolsService,
		// Recaptcha
		{ provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.reCaptchaSiteKey },
		// Import your model services here:
		IdeasService,
	],
	imports: [
		FlamelinkModule.initialize({
			firebaseApp: environment.firebase,
			dbType: 'cf',
		}),
		FLContentModule,
		FLStorageModule,
		FLUsersModule,
		FLSchemasModule,
		FLSettingsModule,
		AngularFireFunctionsModule,
		RecaptchaV3Module,
	]
})
export class DataModule { }
