import { NgModule } from '@angular/core';
import { DataService } from './data.service';
import { AngularFlamelinkModule } from 'angular-flamelink';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFlamelinkTextSearchModule } from 'angular-flamelink-text-search';
import { environment } from '../../../environments/environment';
import { DataToolsService } from './data-tools.service';
import { IdeasService } from './models/ideas/ideas.service';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';

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
		AngularFireModule.initializeApp(environment.firebase),
		AngularFirestoreModule,
		AngularFireAuthModule,
		AngularFireStorageModule,
		AngularFlamelinkModule,
		AngularFlamelinkTextSearchModule,
		RecaptchaV3Module,
	]
})
export class DataModule { }
