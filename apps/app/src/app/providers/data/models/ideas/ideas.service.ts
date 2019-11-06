import { Injectable } from '@angular/core';
import { Idea } from './idea.interface';
import { CF } from '@flamelink/sdk-content-types';
import { FLCollection } from '../flamelink/fl-collection.service';

@Injectable({
	providedIn: 'root'
})
export class IdeasService extends FLCollection<Idea> {

	public options: CF.Get = {
		schemaKey: 'ideas',
		orderBy: {
			field: 'order',
			order: 'desc'
		},
	};

}
