import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FLSettingsService implements FLDashboardSettings {

  public languageChanges = new Observable<string>(observer => {
    observer.next('en-US');
  })

  public localized: string;

  public routePrefix = 'admin';

}

export interface FLDashboardSettings {
  languageObservable?: Observable<any>;
  localized?: string;
  routePrefix?: string;
}