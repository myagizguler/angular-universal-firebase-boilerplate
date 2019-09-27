import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Widgets } from 'open-dashboard';
import { WidgetLinker } from 'open-dashboard';
import { LayoutCol } from 'open-dashboard/lib/widgets/ui/layout/layout.interface';

@Injectable({
	providedIn: 'root'
})
export class SplitDashboard {

	private settings: SplitDashboardSettings = {
		login: (email, password) => { },
		logout: () => { },
		allowAccess: false,
		router: (segments, queryParams) => ({
			widget: ''
		}),
		headerCols: []
	};

	private get loginWidgets(): Widgets {

		return {
			LoginPage: () => ({
				type: 'layout',
				rowClass: 'justify-content-center',
				cols: [
					{
						icon: 'lock',
						title: 'Please login.',
						colClass: 'col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3 p-3',
						widget: 'LoginForm'
					}
				]
			}),
			LoginForm: ({ }) => ({
				type: 'form',
				fields: [
					{
						type: 'text-input',
						name: 'email',
						label: 'Email Address',
					},
					{
						type: 'password-input',
						name: 'password',
						label: 'Password'
					},
				],
				buttons: [
					(form) => ({
						widget: 'LoginButton',
						params: form.value
					})
				]
			}),
			LoginButton: ({ email, password }) => ({
				type: 'button',
				title: 'Login',
				navigate: { commands: [''] },
				action: () => {
					return this.settings.login(email, password);
				}
			}),
			SplitDashboard: () => ({
				type: 'params-reader',
				widget: (segments) => segments[0] === 'login'
					? ({
						widget: 'LoginPage',
					})
					: ({
						widget: 'AuthRedirect',
					})
			})

		};
	}

	private get dashboardWidgets(): Widgets {
		return {
			DashboardHeader: () => ({
				type: 'layout',
				cols: [
					{
						titleClass: 'h4 text-dark px-3',
						title: 'Admin',
						widget: ''
					},
					{
						colClass: 'text-right',
						widget: 'DashboardHeaderButtons'
					},
					...this.settings.headerCols
				],
			}),
			DashboardHeaderButtons: () => ({
				type: 'button',
				title: 'Logout',
				icon: 'logout',
				action: () => this.settings.logout()
			}),
			Dashboard: () => ({
				type: 'layout',
				containerClass: 'p-3',
				rowClass: 'm-0',
				cols: [
					{
						colClass: 'col-12 px-0 py-3',
						widget: 'DashboardHeader'
					},
					{
						colClass: 'col-12 py-5',
						widget: 'Router'
					}
				]
			}),
			FrontSite: () => ({
				type: 'router-outlet',
			}),
			Splitter: () => ({
				type: 'drawer',
				width: '600px',
				position: 'end',
				drawer: {
					widget: 'Dashboard'
				},
				content: {
					widget: 'FrontSite'
				}

			}),
			AuthRedirect: () => ({
				type: 'dynamic',
				data: this.settings.allowAccess,
				widget: allow => {
					return ({
						widget: !!allow ? 'Splitter' : 'FrontSite',
					});
				}
			}),
		};
	}

	private get routerWidgets(): Widgets {
		return {
			Router: () => ({
				type: 'params-reader',
				widget: this.settings.router
			}),
		};
	}

	public widgets(settings: SplitDashboardSettings) {
		this.settings = {
			...this.settings,
			...settings
		};
		return {
			...this.dashboardWidgets,
			...this.loginWidgets,
			...this.routerWidgets
		};
	}

}

export interface SplitDashboardSettings {
	login: (email: string, password: string) => any;
	logout: () => any;
	allowAccess: boolean | Promise<boolean> | Observable<boolean>;
	router: (segments: string[], queryParams: {
		[key: string]: any;
	}) => WidgetLinker;
	headerCols?: LayoutCol[];
}

