import { Injectable } from '@angular/core';
import { Subscription, Observable, Subject } from 'rxjs';
import { switchMap, first, map } from 'rxjs/operators';
import { CF } from '@flamelink/sdk-content-types';
import { FLDocument } from './fl-document.interface';
import { DataToolsService } from '../../data-tools.service';


@Injectable({
	providedIn: 'root'
})
export class FLCollection<DocType extends FLDocument> {

	private _result: Subject<DocType[]> = new Subject();
	public _resultSubscription: Subscription;

	public options: CF.Get;

	constructor(
		public utils: DataToolsService,
	) { }

	public get result() {
		return this._result;
	}

	public updateResult(resultObservable: Observable<DocType[]>) {
		this.stopWatching();
		this._resultSubscription = resultObservable.subscribe(result => this._result.next(result));
	}

	public async add(data: DocType) {
		const lastDocument = await this.utils.flamelink.valueChanges<DocType>({
			schemaKey: this.options.schemaKey,
			orderBy: {
				field: 'order',
				order: 'desc',
			},
			limit: 1
		}).pipe(
			first(),
			map(results => results && results[0])
		).toPromise();

		const order = lastDocument && lastDocument.order && (Number(lastDocument.order) + 1) || 1;
		return this.utils.flamelink.content.add({
			schemaKey: this.options.schemaKey,
			data: { ...data, order }
		});
	}

	public async addWithRecaptcha(data: DocType) {
		const token = await this.utils.recaptchaV3Service.execute('submitIdea').toPromise();
		if (token) {
			const result = await this.utils.functions.httpsCallable('reCaptcha')({ token }).toPromise();
			console.log(result);
			if (result.score > 0.5) {
				return this.add({ ...data, reCaptcha: result });
			}
		}
	}

	// public get(options: GetOptionsSingle): Observable<DocType>;
	// public get(options: GetOptionsMultiple): Observable<DocType[]>;
	public get(options: GetOptionsMultiple = {}) {
		const result = this.utils.flamelink.valueChanges<DocType>({ ...this.options, ...options } as { schemaKey: string });
		return this.utils.languageObservable.pipe(
			switchMap(() => result),
			map(result => result.map(doc => ({ ...doc, ref: this.utils.flamelink.ref(doc.id) })))
		) as (Observable<DocType[]>);
	}

	public getById(id: string, options?: GetOptionsSingle) {
		return id ? this.utils.flamelink.valueChanges<DocType>({ schemaKey: this.options.schemaKey, ...options, entryId: id }) : new Observable<DocType>(o => o.next(null));
	}

	public watch(options: GetOptionsMultiple = {}) {
		this.updateResult(this.get(options));
	}

	public stopWatching() {
		if (this._resultSubscription) {
			this._resultSubscription.unsubscribe();
		}
	}

	public clear() {
		this.stopWatching();
		this._result.next([]);
	}


}

export type GetOptions = GetOptionsSingle | GetOptionsMultiple;

export interface GetOptionsSingle extends CF.Get {
	entryId: string;
}
export interface GetOptionsMultiple extends CF.Get {
	entryId?: null;
}
