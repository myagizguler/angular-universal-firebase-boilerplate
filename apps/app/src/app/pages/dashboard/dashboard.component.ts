import { Component, ViewEncapsulation } from '@angular/core';
import { LanguageService } from '../../providers/language/language.service';
import { WidgetsService } from '@ngx-widgets/core';
import { WidgetsFlamelink } from '@ngx-widgets/flamelink';
import { WidgetsLegacyComponents } from '@ngx-widgets/legacy';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {

	public widgets = this.flWidgets.widgets({
		language: {
			observe: this.language.change,
			change: lang => this.language.language = lang
		},
	});

	constructor(
		private language: LanguageService,
		private widgetsService: WidgetsService,
		private flWidgets: WidgetsFlamelink,
	) { }

	ngOnInit() {
		this.widgetsService.extendWidgets(WidgetsLegacyComponents);
	}


}
