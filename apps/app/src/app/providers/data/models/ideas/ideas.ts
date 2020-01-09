import { Injectable } from '@angular/core';
import { Idea } from './idea';
import { FLCollection } from '../flamelink/fl-collection';

@Injectable({
	providedIn: 'root'
})
export class IdeasService extends FLCollection<Idea> {

	public key = 'ideas';

}
