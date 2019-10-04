import { Injectable } from '@angular/core';
import { FLUsersWidgets } from './widgets/users';
import { FLPermissionsWidgets } from './widgets/permissions';
import { FLContentWidgets } from './widgets/content';
import { FLFieldsWidgets } from './widgets/fields';
import { FLSettingsService, FLDashboardSettings } from './utils/settings.service';
import { Dashboard } from './dashboard/dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class FLWidgets {

  public widgets(settings: FLDashboardSettings) {

    this.settings.update(settings);

    return {
      ...this.contentWidgets.get(),
      ...this.permissionsWidgets.get(),
      ...this.usersWidgets.get(),
      ...this.fieldsWidgets.get(),
      ...this.dashboard.widgets({
        login: this.settings.login,
        logout: this.settings.logout,
        routePrefix: this.settings.routePrefix,
        allowAccess: this.settings.allowAccess,
        sideMenu: this.settings.sideMenu,
        headerCols: this.settings.headerCols,
        router: (segments, queryParams) => {
          const widgetLinker = this.settings.router && this.settings.router(segments, queryParams);

          if (widgetLinker) {
            return widgetLinker;
          }

          switch (queryParams.settings) {
            case undefined:
              break;
            case 'users':
              return {
                widget: 'FLUsersList',
              };
            case 'permissions':
              return {
                widget: 'FLPermissionsList',
              }

          }

          switch (segments[0]) {
            case this.settings.routePrefix:

              switch (segments[1]) {
                case 'collection':
                  return {
                    widget: 'FLCollectionList',
                    params: { schema: segments[2], limit: 20 }
                  }
                case 'form':
                  return {
                    widget: 'FLCollectionList',
                    params: { schema: segments[2], limit: 20 }
                  }
                case 'single':
                  return {
                    widget: 'FLSingleForm',
                    params: { schema: segments[2] }
                  }
              }

            default:
              return {
                widget: 'FLMarkdown',
                params: { content: `**This page has no settings.**` }
              };
          }
        }
      }),
    };
  }


  constructor(
    private dashboard: Dashboard,
    private settings: FLSettingsService,
    private fieldsWidgets: FLFieldsWidgets,
    private usersWidgets: FLUsersWidgets,
    private permissionsWidgets: FLPermissionsWidgets,
    private contentWidgets: FLContentWidgets,
  ) { }


}

