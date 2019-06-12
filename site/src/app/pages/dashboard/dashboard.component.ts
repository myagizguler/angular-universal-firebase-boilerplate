import { Component } from '@angular/core';
import { Widgets } from 'open-dashboard';
import { AngularFlamelink } from 'angular-flamelink';
import { FlamelinkWidgets, FL_WIDGETS } from './flamelink-widgets.service';
import { map, switchMap } from 'rxjs/operators';
import { SplitDashboard } from './split-dashboard.service';
import { LanguageService } from '../../providers/language/language.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {


	private homeWidgets: Widgets = {
		HomePage: () => ({
			type: 'layout',
			cols: [
				{
					colClass: 'col-12 pb-4',
					widget: FL_WIDGETS.FLCollectionList,
					params: { schema: 'members' }
				},
			]
		})
	};


	public widgets: Widgets = {
		...this.flWidgets.widgets({
			languageObservable: this.language.change
		}),
		...this.splitDashboard.widgets({
			login: (email, password) => this.flamelink.auth.auth.signInWithEmailAndPassword(email, password),
			logout: () => this.flamelink.auth.auth.signOut(),
			allowAccess: this.flamelink.auth.user.pipe(map(user => !!user)),
			router: (segments, queryParams) => {
				switch (segments[0]) {
					case undefined:
						return ({
							widget: 'HomePage',
						});
					default:
						return ({
							widget: FL_WIDGETS.FLMarkdown,
							params: { content: `**This page has no settings.**` }
						});
				}
			}
		}),
		...this.homeWidgets
	};

	constructor(
		private language: LanguageService,
		private flamelink: AngularFlamelink,
		private flWidgets: FlamelinkWidgets,
		private splitDashboard: SplitDashboard
	) { }

}
