import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from './providers/data/data.service';
import { LanguageService } from './providers/language/language.service';
import { AuthenticationService } from './providers/authentication/authentication.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
	title = 'project';
	private tokenSubscription: Subscription;

	constructor(
		private data: DataService,
		private language: LanguageService,
		private auth: AuthenticationService,
	) { }

	ngOnInit() {
		this.data.languageObservable = this.language.change;
		this.tokenSubscription = this.auth.refreshTokenOnAuthStateChange();
	}

	ngOnDestroy() {
		if (this.tokenSubscription) {
			this.tokenSubscription.unsubscribe();
		}
	}
}
