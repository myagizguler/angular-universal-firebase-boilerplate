import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FLUsersWidgets } from './widgets/users';
import { FLPermissionsWidgets } from './widgets/permissions';
import { FLContentWidgets } from './widgets/content';
import { FLFieldsWidgets } from './widgets/fields';
import { FLLanguageService } from './utils/language.service';

export interface FLDashboardSettings {
  languageObservable?: Observable<any>;
}

@Injectable({
  providedIn: 'root'
})
export class FLWidgets {

  private defaultSettings: FLDashboardSettings = {
    languageObservable: new Observable(observer => {
      observer.next('en-US');
    })
  };

  public widgets(settings: FLDashboardSettings = {}) {
    settings = {
      ...this.defaultSettings,
      ...settings
    };

    this.language.valueChanges = settings.languageObservable;

    return {
      ...this.contentWidgets.get(),
      ...this.permissionsWidgets.get(),
      ...this.usersWidgets.get(),
      ...this.fieldsWidgets.get(),
    };
  }


  constructor(
    private language: FLLanguageService,
    private fieldsWidgets: FLFieldsWidgets,
    private usersWidgets: FLUsersWidgets,
    private permissionsWidgets: FLPermissionsWidgets,
    private contentWidgets: FLContentWidgets,
  ) { }


}

