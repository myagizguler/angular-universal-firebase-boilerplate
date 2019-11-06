import { Component } from '@angular/core';
import { LanguageService } from 'src/app/providers/language/language.service';
import { DataService } from 'src/app/providers/data/data.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

	public ideas = this.data.ideas.get();

	constructor(
		public language: LanguageService,
		private data: DataService
	) { }

}
