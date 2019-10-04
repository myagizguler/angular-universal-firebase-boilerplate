import { NgModule } from '@angular/core';
import { FLUsersWidgets } from './widgets/users';
import { FLWidgets } from './fl-widgets.service';
import { FLPermissionsWidgets } from './widgets/permissions';
import { FLContentWidgets } from './widgets/content';
import { FLMediaService } from './utils/media.service';
import { FLContentService } from './utils/content.service';
import { FLFieldsWidgets } from './widgets/fields';
import { FLSettingsService } from './utils/settings.service';
import { Dashboard } from './dashboard/dashboard.service';

@NgModule({
  imports: [

  ],
  providers: [
    // Dashboard
    Dashboard,
    // Service
    FLWidgets,
    // Widgets
    FLUsersWidgets,
    FLPermissionsWidgets,
    FLContentWidgets,
    FLFieldsWidgets,
    // Utils
    FLMediaService,
    FLContentService,
    FLSettingsService,
  ]
})
export class FLWidgetsModule { }
