import { Component, ViewEncapsulation } from '@angular/core';
import { Widgets } from 'open-dashboard';
import { AngularFlamelink } from 'angular-flamelink';
import { map } from 'rxjs/operators';
import { SplitDashboard } from './split-dashboard.service';
import { LanguageService } from '../../providers/language/language.service';
import { FL_WIDGETS, FLWidgets } from '../../providers/fl-widgets';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {

	private routePrefix = 'admin';

	private menuWidgets: Widgets = {
		Menu: {
			type: 'repeater',
			value: [
				{ title: 'Content' },
				{ settings: 'users', title: 'Users' },
				{ settings: 'permissions', title: 'Permissions' },
			],
			widget: row => ({
				widget: 'MenuButton',
				params: row.data
			})
		},
		MenuButton: ({ title, settings }) => ({
			type: 'button',
			title,
			navigate: {
				commands: [],
				extras: {
					queryParams: settings
						? {
							settings,
							title
						}
						: {}
				}
			}
		}),
	};


	private homeWidgets: Widgets = {
		HomePage: () => ({
			type: 'layout',
			cols: [
				{
					colClass: 'col-12 pb-4',
					widget: FL_WIDGETS.FLCollectionList,
					params: { schema: 'news' }
				},
			]
		})
	};


	public widgets: Widgets = {
		...this.flWidgets.widgets({
			languageObservable: this.language.change,
			routePrefix: this.routePrefix,
			localized: 'DATABASE',
		}),
		...this.splitDashboard.widgets({
			login: (email, password) => this.flamelink.auth.auth.signInWithEmailAndPassword(email, password),
			logout: () => this.flamelink.auth.auth.signOut(),
			routePrefix: this.routePrefix,
			allowAccess: this.flamelink.auth.user.pipe(map(user => !!user)),
			sideMenu: 'FLSideMenu',
			headerCols: [
				{
					colClass: 'col-12 border-bottom admin-menu',
					widget: 'Menu'
				}
			],
			router: (segments, queryParams) => {
				switch (queryParams.settings) {
					case undefined:
						break;
					case 'users':
						return {
							widget: FL_WIDGETS.FLUsersList,
						};
					case 'permissions':
						return {
							widget: FL_WIDGETS.FLPermissionsList,
						}

				}

				switch (segments[0]) {
					case this.routePrefix:

						switch (segments[1]) {
							case 'collection':
								return {
									widget: FL_WIDGETS.FLCollectionList,
									params: { schema: segments[2], limit: 20 }
								}
							case 'form':
								return {
									widget: FL_WIDGETS.FLCollectionList,
									params: { schema: segments[2], limit: 20 }
								}
							case 'single':
								return {
									widget: FL_WIDGETS.FLSingleForm,
									params: { schema: segments[2] }
								}
						}

					case undefined:
						return ({
							widget: 'HomePage',
						});
					default:
						return {
							widget: FL_WIDGETS.FLMarkdown,
							params: { content: `**This page has no settings.**` }
						};
				}
			}
		}),
		...this.menuWidgets,
		...this.homeWidgets
	};

	constructor(
		private language: LanguageService,
		private flamelink: AngularFlamelink,
		private flWidgets: FLWidgets,
		private splitDashboard: SplitDashboard
	) { }

}
