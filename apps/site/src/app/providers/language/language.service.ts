import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
	providedIn: 'root'
})
export class LanguageService {

	public defaultLanguage = 'en-US';

	public change: ReplaySubject<string> = new ReplaySubject();

	constructor(
		private translate: TranslateService,
		@Inject(PLATFORM_ID) private platformId: Object
	) {
		translate.setDefaultLang(this.defaultLanguage);
		this.translate.use(this.language);
		this.change.next(this.language);
	}

	public get language() {
		let _language;

		if (isPlatformBrowser(this.platformId)) {
			_language = localStorage.getItem('language');
		}

		if (!_language || _language === 'null' || _language === 'false') {
			_language = this.defaultLanguage;
		}
		return _language;
	}

	public set language(value: string) {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.setItem('language', value);
		}
		this.translate.use(value);
		this.change.next(this.language);
	}

}
