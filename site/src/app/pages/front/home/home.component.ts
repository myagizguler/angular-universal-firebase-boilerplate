import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../providers/language/language.service';
import { DataService } from '../../../providers/data/data.service';
import { LoadingComponent } from '../../../components/loader/loading.component';
import { LoaderService } from '../../../components/loader/loader.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent extends LoadingComponent implements OnInit {

	public news = this.data.news();
	public loadingObservables = [this.news];

	constructor(
		loader: LoaderService,
		private language: LanguageService,
		private data: DataService,

	) {
		super(loader);
	}

	ngOnInit() {
		super.ngOnInit();
	}

	switchLanguage(language: string) {
		this.language.language = language;
	}

}
