import { Injectable } from '@angular/core';
import { Article } from './article.interface';
import { CF } from '@flamelink/sdk-content-types';
import { FLCollection } from '../flamelink/fl-collection.service';

@Injectable({
	providedIn: 'root'
})
export class ArticlesService extends FLCollection<Article> {

	public options: CF.Get = {
		schemaKey: 'news',
		populate: ['hashtags'],
		orderBy: {
			field: 'date',
			order: 'desc',
		},
		startAt: 0,
		limit: 20
	};



}
