import { NgModule } from '@angular/core';
import { DataService } from './data.service';
import { AngularFlamelinkModule } from 'angular-flamelink';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFlamelinkTextSearchModule } from 'angular-flamelink-text-search';
import { environment } from '../../../environments/environment';

@NgModule({
	providers: [
		DataService
	],
	imports: [
		AngularFireModule.initializeApp(environment.firebase),
		AngularFirestoreModule,
		AngularFireAuthModule,
		AngularFireStorageModule,
		AngularFlamelinkModule,
		AngularFlamelinkTextSearchModule
	],
})
export class DataModule { }
