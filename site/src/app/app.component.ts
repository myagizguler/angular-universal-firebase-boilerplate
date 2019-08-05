import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './providers/authentication/authentication.service';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { DataToolsService } from './providers/data/data-tools.service';
import { LanguageService } from './providers/language/language.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
	title = 'Project Name';

	private tokenSubscription: Subscription;

	constructor(
		private ga: Angulartics2GoogleAnalytics,
		private auth: AuthenticationService,
		private dataTools: DataToolsService,
		private language: LanguageService,
	) { }

	ngOnInit() {
		this.ga.startTracking();
		this.tokenSubscription = this.auth.refreshTokenOnAuthStateChange();
		this.dataTools.languageObservable = this.language.change;
	}

	ngOnDestroy() {
		if (this.tokenSubscription) {
			this.tokenSubscription.unsubscribe();
		}
	}

}
