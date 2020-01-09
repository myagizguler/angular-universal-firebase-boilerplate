import { Component } from '@angular/core';
import { LanguageService } from '../../../providers/language/language.service';
import { DataService } from '../../../providers/data/data.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

	public ideas = this.data.ideas.valueChanges();

	constructor(
		public language: LanguageService,
		private data: DataService,
	) { }

}
