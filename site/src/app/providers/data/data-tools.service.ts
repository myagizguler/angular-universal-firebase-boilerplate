import { AngularFlamelink } from 'angular-flamelink';
import { Observable, combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class DataToolsService {

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
		});
	}

	constructor(
		public flamelink: AngularFlamelink,
	) { }

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

}
