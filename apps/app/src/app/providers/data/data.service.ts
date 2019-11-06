import { Injectable } from '@angular/core';
import { AngularFlamelinkTextSearch } from 'angular-flamelink-text-search';
import { IdeasService } from './models/ideas/ideas.service';
import { DataToolsService } from './data-tools.service';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	constructor(
		private flamelinkSearch: AngularFlamelinkTextSearch,
		public utils: DataToolsService,
		// Import your model services here to access them from withing the data service.
		public ideas: IdeasService,
	) { }


	public async search(query: string, start: number = 1, limit: number = 20) {
		const result = await this.flamelinkSearch.search({
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
