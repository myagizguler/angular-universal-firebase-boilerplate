import { Injectable } from '@angular/core';
import { IdeasService } from './models/ideas/ideas';
import { DataToolsService } from './data-tools.service';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	constructor(
		public utils: DataToolsService,
		// Import your model services here to access them from withing the data service.
		public ideas: IdeasService,
		private functions: AngularFireFunctions
	) { }


	public async search(query: string, start: number = 1, limit: number = 20) {
		const locale = await this.utils.settings.getLocale();
		const result = await this.functions.functions.httpsCallable('search')({
			locale,
			query, start, limit,
			schemas: [
				{ schemaKey: 'ideas' },

				// Add schemas you wish to include in your search.
			]
		});
		if (result.data) {
			return result.data;
		} else {
			return [];
		}

	}


}
