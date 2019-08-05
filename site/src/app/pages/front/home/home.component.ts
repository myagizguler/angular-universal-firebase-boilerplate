import { Component, OnInit, OnDestroy } from '@angular/core';
import { LanguageService } from '../../../providers/language/language.service';
import { DataService } from '../../../providers/data/data.service';
import { LoadingComponent } from '../../../components/loader/loading.component';
import { LoaderService } from '../../../components/loader/loader.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent extends LoadingComponent implements OnInit, OnDestroy {

	// Subscribe this.articles to the result of last query performs.
	public articles = this.data.articles.result;

	// Observables to wait for before stopping the loading indicator.
	public loadingObservables = [this.articles];

	constructor(
		loader: LoaderService,
		private language: LanguageService,
		private data: DataService,

	) {
		super(loader);
	}

	ngOnInit() {
		super.ngOnInit();
		// Perform the default query and save the results to this.data.articles.results as an Observable of Articles.
		this.data.articles.watch();
		this.articles.subscribe(console.log);
	}
	ngOnDestroy() {
		super.ngOnDestroy();
		// Remember to destroy the subscription when the component is not using it anymore.
		this.data.articles.stopWatching();
	}

	switchLanguage(language: string) {
		this.language.language = language;
	}

}
