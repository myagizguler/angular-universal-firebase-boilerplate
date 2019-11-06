import { Component, ViewEncapsulation } from '@angular/core';
import { Widgets } from 'open-dashboard';
import { LanguageService } from '../../providers/language/language.service';
import { FLWidgets } from 'fl-widgets';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {

	public widgets: Widgets = {
		...this.flWidgets.widgets({
			languageChanges: this.language.change,
			headerCols: [],
		}),
	};

	constructor(
		private language: LanguageService,
		private flWidgets: FLWidgets,
	) { }

}
