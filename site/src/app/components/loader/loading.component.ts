import { OnInit, OnDestroy } from '@angular/core';
import { Subscription, combineLatest, Observable } from 'rxjs';
import { LoaderService } from '../../components/loader/loader.service';

export class LoadingComponent implements OnInit, OnDestroy {

	public loadingObservables: Observable<any>[] = [];
	private subscription: Subscription;

	constructor(
		private _loader: LoaderService
	) { }

	ngOnInit() {
		this.resubscribeLoader();
	}

	public resubscribeLoader() {
		this._loader.show();
		const observables = combineLatest(...this.loadingObservables);
		this.subscription = observables.subscribe(() => this._loader.hide());

	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

}
