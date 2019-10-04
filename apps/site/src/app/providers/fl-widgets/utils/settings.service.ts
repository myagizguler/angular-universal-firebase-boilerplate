import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardSettings } from '../dashboard/dashboard.service';
import { AngularFlamelink } from 'angular-flamelink';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FLSettingsService implements FLDashboardSettings {

  private settings: FLDashboardSettings = {
    languageChanges: new Observable<string>(observer => {
      observer.next('en-US');
    }),
    localized: null,
    routePrefix: 'admin',
    login: (email, password) => this.flamelink.auth.auth.signInWithEmailAndPassword(email, password),
    logout: () => this.flamelink.auth.auth.signOut(),
    allowAccess: this.flamelink.auth.user.pipe(map(user => !!user)),
    router: null,
    sideMenu: 'FLSideMenu',
    headerCols: [
      {
        colClass: 'col-12 border-bottom admin-menu',
        widget: 'FLTopMenu'
      }
    ]

  }

  public get languageChanges() {
    return this.settings.languageChanges;
  }

  public get localized() {
    return this.settings.localized;
  }

  public get routePrefix() {
    return this.settings.routePrefix;
  }

  public get login() {
    return this.settings.login;
  }

  public get logout() {
    return this.settings.logout;
  }

  public get allowAccess() {
    return this.settings.allowAccess;
  }

  public get router() {
    return this.settings.router;
  }

  public get sideMenu() {
    return this.settings.sideMenu;
  }

  public get headerCols() {
    return this.settings.headerCols;
  }

  constructor(
    private flamelink: AngularFlamelink
  ) { }

  public update(settings: FLDashboardSettings) {
    this.settings = {
      ...this.settings,
      ...settings
    }
  }

}

export interface FLDashboardSettings extends DashboardSettings {
  languageChanges?: Observable<any>;
  localized?: string;
  routePrefix?: string;

}