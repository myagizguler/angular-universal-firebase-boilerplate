import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../providers/language/language.service';
import { DataService } from 'src/app/providers/data/data.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	public news = this.data.news();

	constructor(
		private language: LanguageService,
		private data: DataService
	) { }

	ngOnInit() {
	}

	switchLanguage(language: string) {
		this.language.language = language;
	}

}
