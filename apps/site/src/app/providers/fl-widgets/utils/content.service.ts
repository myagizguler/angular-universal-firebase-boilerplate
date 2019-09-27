import { Injectable } from '@angular/core';
import { AngularFlamelink } from 'angular-flamelink';
import { Widget, DynamicWidget } from 'open-dashboard';
import { FL_WIDGETS } from '../widgets';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';
import { FLLanguageService } from './language.service';
import { Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FLContentService {

  constructor(
    private flamelink: AngularFlamelink,
    private translate: TranslateService,
    private language: FLLanguageService
  ) { }

  public async getOverviewFields(schemaName: string) {
    const fields = schemaName ? await this.flamelink.schemas.getFields({
      schemaKey: schemaName,
    }) : null;
    if (fields) {
      return fields.filter(field =>
        field.show &&
        (['text', 'email', 'markdown-editor', 'number', 'select'].indexOf(field.type) >= 0)
      ).map(field => field.key);
    }
    return [];
  }

  public getSchemaAutoForm(schemaName: string, localized?: string) {

    return this.flamelink.angularFire
      .collection('fl_schemas', q => q.where('id', '==', schemaName))
      .valueChanges()
      .pipe(
        map((result: any) => result && result[0] && result[0].fields),
        switchMap((fields: any) => {
          return this.flSchemaToAutoForm(fields || [], localized, schemaName);
        })
      );

  }

  public flSchemaToAutoForm(fields: any[], localized?: string, schemaKey?: string) {
    const languageChange = localized
      ? this.language.valueChanges.pipe(switchMap(() => this.translate.get(localized)))
      : new Observable(observer => observer.next())

    return languageChange.pipe(
      map(

        translations => {
          const fieldWidgets = fields
            .map((field) => {


              field.name = field.key;
              if (schemaKey) {
                field.schema = schemaKey;
              }
              field.label = localized ? translations[field.key] ? translations[field.key].title : (localized + '.' + field.key + '.title') : field.title;
              field.description = localized ? translations[field.key] ? translations[field.key].description : (localized + '.' + field.key + '.description') : field.description;
              field.validators = []

              const rules: any[] = field.constraints || [];

              rules.forEach(rule => {
                if (rule.rule === 'presence' && !rule.ruleValue.allowEmpty) {
                  field.validators.push(Validators.required);
                }
                if (rule.rule === 'length' && !!rule.ruleValue) {
                  if (rule.ruleValue.is) {
                    field.validators.push(Validators.minLength(rule.ruleValue.is));
                    field.validators.push(Validators.maxLength(rule.ruleValue.is));
                  } else {
                    if (rule.ruleValue.minimum) {
                      field.validators.push(Validators.minLength(rule.ruleValue.minimum));
                    }
                    if (rule.ruleValue.maximum) {
                      field.validators.push(Validators.maxLength(rule.ruleValue.maximum));
                    }
                  }
                }
                if (rule.rule === 'format' && !!rule.ruleValue) {
                  if (rule.ruleValue.pattern) {
                    const regex = new RegExp(rule.ruleValue.pattern, rule.ruleValue.flag);
                    field.validators.push(Validators.pattern(regex));
                  }
                }

                //
                if (rule.rule === 'date' && !!rule.ruleValue) {
                  if (rule.ruleValue.max) {
                    field.max = rule.ruleValue.max === 'NOW' ? new Date() : new Date(rule.ruleValue.max);
                  }
                  if (rule.ruleValue.min) {
                    field.min = rule.ruleValue.min === 'NOW' ? new Date() : new Date(rule.ruleValue.min);
                  }
                }
              });

              const widgetNames = {
                'fieldset': FL_WIDGETS.FLForm,
                'date': FL_WIDGETS.FLFieldDate,
                'time': FL_WIDGETS.FLFieldDate,
                'datetime-local': FL_WIDGETS.FLFieldDate,
                'select': FL_WIDGETS.FLFieldSelect,
                'repeater': FL_WIDGETS.FLFieldRepeater,
                'select-relational': FL_WIDGETS.FLFieldSelectRelational,
                'markdown-editor': FL_WIDGETS.FLFieldMarkdown,
                'media': FL_WIDGETS.FLFieldMedia,
                'text': FL_WIDGETS.FLFieldText,
                'boolean': FL_WIDGETS.FLFieldBoolean,
                'radio': FL_WIDGETS.FLFieldRadio,
              };

              const widget: DynamicWidget = {
                ...field,
                type: 'dynamic',
                data: field.type,
                name: field.key,
                defaultValue: field.defaultValue
              }

              widget.widget = (type) => {
                return ({
                  widget: widgetNames[type] || widgetNames['text'],
                  params: { field, localized }
                });
              };

              return widget;
            });

          return fieldWidgets;
        }
      )
    )



  }

}
