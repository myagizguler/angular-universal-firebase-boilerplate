import { Component, ViewEncapsulation } from '@angular/core';
import { Widgets } from 'open-dashboard';
import { LanguageService } from '../../providers/language/language.service';
import { FL_WIDGETS, FLWidgets } from 'fl-widgets';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {

	private routePrefix = 'admin';

	private homeWidgets: Widgets = {
		HomePage: () => ({
			type: 'layout',
			cols: [
				{
					colClass: 'col-12 pb-4',
					widget: FL_WIDGETS.FLCollectionList,
					params: { schema: 'articles' }
				},
			]
		})
	};

	public widgets: Widgets = {
		...this.flWidgets.widgets({
			languageChanges: this.language.change,
			routePrefix: this.routePrefix,
			localized: 'DATABASE',
			router: (segments, queryParams) => {
				switch (segments[0]) {
					case undefined:
						return {
							widget: 'HomePage'
						}
				}
			}
		}),
		...this.homeWidgets
	};

	constructor(
		private language: LanguageService,
		private flWidgets: FLWidgets,
	) { }

}
