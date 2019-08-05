import { Injectable } from '@angular/core';
import { CF } from '@flamelink/sdk-content-types';
import { FLCollection } from '../flamelink/fl-collection.service';
import { Hashtag } from './hashtag.interface';


@Injectable({
	providedIn: 'root'
})
export class HashtagsService extends FLCollection<Hashtag> {

	public options: CF.Get = {
		schemaKey: 'hashtags'
	};

}
