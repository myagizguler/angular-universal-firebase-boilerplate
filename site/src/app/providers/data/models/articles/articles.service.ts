import { Injectable } from '@angular/core';
import { Article } from './article.interface';
import { CF } from '@flamelink/sdk-content-types';
import { FLCollection } from '../flamelink/fl-collection.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ArticleFilters {
	hashtags?: string[];
	areasOfFocus?: string[];
}

@Injectable({
	providedIn: 'root'
})
export class ArticlesService extends FLCollection<Article> {

	public options: CF.Get = {
		schemaKey: 'news',
		populate: ['hashtags'],
		orderBy: {
			field: 'newsDate',
			order: 'desc',
		},
		startAt: 0,
		limit: 20
	};

	public filter(filters: ArticleFilters, limit = 12) {
		const observables: Observable<Article[]>[] = [];

		if (filters.hashtags && filters.hashtags.length) {
			observables.push(
				this.utils.combineAndMergeUnique(
					filters.hashtags.map(
						id => this.get({ limit, filters: [['hashtag', 'array-contains', this.flamelink.ref(id)]] })
					)
				)
			);
		}

		if (filters.areasOfFocus && filters.areasOfFocus.length) {
			observables.push(
				this.utils.combineAndMergeUnique(
					filters.areasOfFocus.map(
						id => this.get({ limit, filters: [['newsAreaOfFocus', '==', this.flamelink.ref(id)]] })
					)
				)
			);
		}

		if (!observables.length) {
			observables.push(
				this.get({ limit })
			);
		}

		const orderField = this.options.orderBy['field'];
		const orderDesc = this.options.orderBy['order'] === 'desc';

		const combinedObservables = this.utils.combineAndMergeUnique([
			this.utils.combineAndMergeMutual(observables)
		]).pipe(
			map(result => result.sort((a, b) =>
				(a[orderField] >= b[orderField])
					? orderDesc ? -1 : 1
					: orderDesc ? 1 : -1
			)),
			map(result => result.slice(0, limit))

		);

		this.updateResult(combinedObservables);
	}


}
