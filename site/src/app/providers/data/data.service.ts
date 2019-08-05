import { Injectable } from '@angular/core';
import { AngularFlamelink } from 'angular-flamelink';
import { Observable, combineLatest, Subscription } from 'rxjs';
import { Article } from './types/article.interface';
import { switchMap, map } from 'rxjs/operators';
import { AngularFlamelinkTextSearch } from 'angular-flamelink-text-search';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	private $languageSubscription: Subscription;
	private $languageObservable = new Observable<string>(observer => {
		observer.next();
	});

	public get languageObservable() {
		return this.$languageObservable;
	}

	public set languageObservable(observable: Observable<string>) {
		this.$languageObservable = observable;
		if (this.$languageSubscription) {
			this.$languageSubscription.unsubscribe();
		}
		this.$languageSubscription = this.$languageObservable.subscribe(language => {
			this.flamelink.settings.setLocale(language);
			console.log('Flamlink Locale: ' + language);
		});
	}

	constructor(
		private flamelink: AngularFlamelink,
		private flamelinkSearch: AngularFlamelinkTextSearch,
	) { }



	public async search(query: string, start: number = 1, limit: number = 20) {
		const result = await this.flamelinkSearch.search({
			query, start, limit,
			schemas: [
				{ schemaKey: 'members' },
				{ schemaKey: 'articles' },
				{ schemaKey: 'investments' },
				{ schemaKey: 'reports' },
			]
		});
		if (result.data) {
			return result.data;
		} else {
			return [];
		}
	}

	public getPhotoUrl(id: string, size = '1920_9999_100'): Promise<string> {
		return id
			? this.flamelink.storage.getURL({
				fileId: id,
				size: { path: size }
			})
			: Promise.resolve(null);
	}

	public combineAndMergeUnique<T extends { id: string }>(observables: Observable<T[]>[]) {
		return combineLatest(observables).pipe(
			map(
				arrays => {
					const merged: T[] = [].concat.apply([], arrays);
					const unique: T[] = [];
					const ids = [];

					merged.map(article => {
						if (ids.indexOf(article.id) < 0) {
							ids.push(article.id);
							unique.push(article);
						}
					});

					return unique;
				}
			)
		);
	}

	public combineAndMergeMutual<T extends { id: string }>(observables: Observable<T[]>[]) {
		return combineLatest(observables).pipe(
			map(
				arrays => {
					let mutual: T[] = [];
					const ids = [];

					let i = 0;
					arrays.map(array => {
						if (i === 0) {
							mutual = array;
							i++;
						} else {
							mutual = mutual.filter(value => !!array.find(result => value.id === result.id));
						}
					});

					return mutual;
				}
			)
		);
	}

	public news() {

		const result = this.flamelink.valueChanges<Article>({
			schemaKey: 'news',
		}).pipe<Article[]>(
			switchMap(articles => {
				return Promise.all(
					articles.map(async article => (article.thumbnailImage && article.thumbnailImage[0])
						? {
							...article,
							thumbnailImageUrl: await this.getPhotoUrl(article.thumbnailImage[0].id, '1920_9999_100')
						}
						: article
					)
				);
			})
		);
		return this.languageObservable.pipe(switchMap(() => result));
	}


}
