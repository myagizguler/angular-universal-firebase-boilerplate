import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FLUsersWidgets } from './widgets/users';
import { FLPermissionsWidgets } from './widgets/permissions';
import { FLContentWidgets } from './widgets/content';
import { FLFieldsWidgets } from './widgets/fields';
import { FLSettingsService, FLDashboardSettings } from './utils/settings.service';



@Injectable({
  providedIn: 'root'
})
export class FLWidgets {

  private defaultSettings: FLDashboardSettings = {
    languageObservable: new Observable(observer => {
      observer.next('en-US');
    }),
    routePrefix: 'admin'
  };

  public widgets(settings: FLDashboardSettings = {}) {
    settings = {
      ...this.defaultSettings,
      ...settings
    };

    this.settings.languageChanges = settings.languageObservable;
    this.settings.localized = settings.localized;

    return {
      ...this.contentWidgets.get(),
      ...this.permissionsWidgets.get(),
      ...this.usersWidgets.get(),
      ...this.fieldsWidgets.get(),
    };
  }


  constructor(
    private settings: FLSettingsService,
    private fieldsWidgets: FLFieldsWidgets,
    private usersWidgets: FLUsersWidgets,
    private permissionsWidgets: FLPermissionsWidgets,
    private contentWidgets: FLContentWidgets,
  ) { }


}

