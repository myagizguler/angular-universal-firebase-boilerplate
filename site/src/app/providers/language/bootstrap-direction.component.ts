import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LanguageService } from './language.service';

@Component({
	selector: 'bootstrap-direction',
	templateUrl: './bootstrap-direction.component.html',
	styleUrls: ['./bootstrap-direction.component.scss']
})
export class BootstrapDirectionComponent implements OnInit {

	public rtl: boolean;

	@Output() change: EventEmitter<string> = new EventEmitter();

	constructor(
		private languageService: LanguageService
	) { }

	ngOnInit() {
		this.languageService.change.subscribe(language => {
			this.rtl = (language === 'ar');
			this.change.emit(language);
		});
	}

}
