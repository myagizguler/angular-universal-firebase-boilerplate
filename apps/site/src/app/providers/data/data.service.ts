import { Injectable } from '@angular/core';
import { AngularFlamelinkTextSearch } from 'angular-flamelink-text-search';
import { ArticlesService } from './models/articles/articles.service';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	constructor(
		private flamelinkSearch: AngularFlamelinkTextSearch,
		// Import your model services here to access them from withing the data service.
		public articles: ArticlesService,
	) { }

	public async search(query: string, start: number = 1, limit: number = 20) {
		const result = await this.flamelinkSearch.search({
			query, start, limit,
			schemas: [
				{ schemaKey: 'articles' },
			]
		});
		if (result.data) {
			return result.data;
		} else {
			return [];
		}

	}


}
