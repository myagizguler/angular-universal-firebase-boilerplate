import { Injectable } from '@angular/core';
import { AngularFlamelinkTextSearch } from 'angular-flamelink-text-search';
import { ArticlesService } from './models/articles/articles.service';
import { HashtagsService } from './models/hashtags/hashtags.service';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	constructor(
		private flamelinkSearch: AngularFlamelinkTextSearch,
		public articles: ArticlesService,
		public hashtags: HashtagsService,
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
