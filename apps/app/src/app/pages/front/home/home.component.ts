import { Component } from '@angular/core';
import { LanguageService } from '../../../providers/language/language.service';
import { DataService } from '../../../providers/data/data.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

	public ideas = this.data.ideas.get();
	// public ideas = this.content.valueChanges({ schemaKey: 'ideas' })

	constructor(
		public language: LanguageService,
		private data: DataService,
		// private content: FLContent
	) { }

}
