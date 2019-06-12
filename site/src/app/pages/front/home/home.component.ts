import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/providers/language/language.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	constructor(
		private language: LanguageService
	) { }

	ngOnInit() {
	}

	switchLanguage(language: string) {
		this.language.language = language;
	}




}
