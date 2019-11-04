import { Component, OnInit } from '@angular/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { DataToolsService } from './providers/data/data-tools.service';
import { LanguageService } from './providers/language/language.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'Project Name';

	constructor(
		private ga: Angulartics2GoogleAnalytics,
		private dataTools: DataToolsService,
		private language: LanguageService,
	) { }

	ngOnInit() {
		this.ga.startTracking();
		this.dataTools.languageObservable = this.language.change;
	}

}
