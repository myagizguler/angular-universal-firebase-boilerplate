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
		@Inject(PLATFORM_ID) private platformId: Object,
	) {
		this.language = this.language;
	}

	public get language() {
		let _language: string;

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
			this.setHtmlTags(value);
		}
		this.translate.setDefaultLang(this.defaultLanguage);
		this.translate.use(value)
		this.change.next(this.language);
	}

	private setHtmlTags(lang: string) {
		try {
			const langAttr = document.createAttribute('lang');
			langAttr.value = lang;
			document.querySelector('html').attributes.setNamedItem(langAttr);

			const dirAttr = document.createAttribute('dir');
			dirAttr.value = 'ltr';
			if (lang === 'ar') {
				dirAttr.value = 'rtl';
			}
			document.querySelector('body').className = dirAttr.value;
			document.querySelector('html').attributes.setNamedItem(dirAttr);
		} catch (e) { }
	}


}
