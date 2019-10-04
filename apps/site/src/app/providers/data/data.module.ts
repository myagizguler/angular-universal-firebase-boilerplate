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
import { ArticlesService } from './models/articles/articles.service';

@NgModule({
	providers: [
		DataService,
		DataToolsService,
		// Import your model services here:
		ArticlesService,
	],
	imports: [
		AngularFireModule.initializeApp(environment.firebase),
		AngularFirestoreModule,
		AngularFireAuthModule,
		AngularFireStorageModule,
		AngularFlamelinkModule,
		AngularFlamelinkTextSearchModule,
	],
})
export class DataModule { }
