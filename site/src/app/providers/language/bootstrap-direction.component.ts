import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { LanguageService } from './language.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'bootstrap-direction',
	templateUrl: './bootstrap-direction.component.html',
	styleUrls: ['./bootstrap-direction.component.scss']
})
export class BootstrapDirectionComponent implements OnInit, OnDestroy {

	public rtl: boolean;
	private subscription: Subscription;

	@Output() change: EventEmitter<string> = new EventEmitter();

	constructor(
		private languageService: LanguageService
	) { }

	ngOnInit() {
		this.subscription = this.languageService.change.subscribe(language => {
			this.rtl = (language === 'ar');
			this.change.emit(language);
		});
	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

}
