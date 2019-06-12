import { Component } from '@angular/core';
import { DataService } from './providers/data/data.service';
import { LanguageService } from './providers/language/language.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'project';

	constructor(
		private data: DataService,
		private language: LanguageService
	) {
		this.data.languageObservable = this.language.change;
	}
}
