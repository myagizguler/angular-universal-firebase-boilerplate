import { Injectable } from '@angular/core';
import { AngularFlamelink } from 'angular-flamelink';
import { Subscription, Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
		public flamelink: AngularFlamelink,
		public utils: DataToolsService,
	) { }

	public get result() {
		return this._result;
	}

	public updateResult(resultObservable: Observable<DocType[]>) {
		this.stopWatching();
		this._resultSubscription = resultObservable.subscribe(result => this._result.next(result));
	}

	public add(data: DocType) {
		return this.flamelink.content.add({
			schemaKey: this.options.schemaKey,
			data
		});
	}

	public get(options: CF.Get = {}) {
		const result = this.flamelink.valueChanges<DocType>({ ...this.options, ...options } as { schemaKey: string });
		return this.utils.languageObservable.pipe(switchMap(() => result));
	}

	public watch(options: CF.Get = {}) {
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
