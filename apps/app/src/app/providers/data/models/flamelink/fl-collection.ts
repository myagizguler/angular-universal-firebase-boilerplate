import { Injectable } from '@angular/core';
import { switchMap, first, map } from 'rxjs/operators';
import { FLDocument } from './fl-document';
import { DataToolsService } from '../../data-tools.service';
import * as App from '@flamelink/sdk-app-types'
type Options = App.CF.Options | App.RTDB.Options;

@Injectable({
	providedIn: 'root'
})
export class FLCollection<DocType extends FLDocument> {

	public key: string;
	public defaultOptions: Options = {
		orderBy: {
			field: 'order',
			order: 'desc'
		}
	}

	constructor(
		public utils: DataToolsService,
	) { }

	public ref(id: string) {
		return this.utils.content.ref(id);
	}

	public valueChanges(options: Options = {}) {
		return this.utils.languageObservable.pipe(
			switchMap(
				() => this.utils.content.valueChanges<DocType[]>({ schemaKey: this.key, ...this.defaultOptions, ...options })
			)
		);
	}

	public async add(data: DocType, options: Options = {}, recaptcha?: string) {

		if (recaptcha) {
			await this.utils.recaptchaPassed(recaptcha);
		}

		const lastDocument = await this.utils.content.valueChanges<DocType[]>({
			schemaKey: this.key,
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
		return this.utils.content.add<DocType>({
			...this.defaultOptions,
			...options,
			schemaKey: this.key,
			data: { ...data, order }
		});
	}

	public async update(id: string, data: DocType, options: Options = {}, recaptcha?: string) {
		if (recaptcha) {
			await this.utils.recaptchaPassed(recaptcha);
		}
		return this.utils.content.update({
			...this.defaultOptions,
			...options,
			schemaKey: this.key,
			entryId: id,
			data
		})
	}

	public async remove(id: string, options: Options = {}, recaptcha?: string) {
		if (recaptcha) {
			await this.utils.recaptchaPassed(recaptcha);
		}
		return this.utils.content.remove({
			...this.defaultOptions,
			...options,
			schemaKey: this.key,
			entryId: id
		})
	}


}
