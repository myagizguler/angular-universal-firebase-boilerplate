import { Injectable } from '@angular/core';
import { AngularFlamelink } from 'angular-flamelink';
import { Widget, DynamicWidget } from 'open-dashboard';
import { FL_WIDGETS } from '../widgets';
import { TranslateService } from '@ngx-translate/core';
import { Observable, combineLatest } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';
import { FLSettingsService } from './settings.service';
import { Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FLContentService {

  constructor(
    private flamelink: AngularFlamelink,
    private translate: TranslateService,
    private settings: FLSettingsService
  ) { }

  public formatField(doc: any, field: any) {
    let html = '';
    switch (field.type) {
      case 'fieldset':
        const data: Record<string, any> = this.formatDocument(doc, field.overviewFields.map(overviewField => field.options.find(option => option.key === overviewField))) || {};
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            html += '<div class="fl-overview-field-wrapper">'
            html += `<div class="fl-overview-field-key">${field.options.find(option => option.key === key).title}</div>`
            html += `<div class="fl-overview-field-value">${data[key]}</div>`
            html += '</div>'
          }
        };
        break;
      case 'media':
        (doc || []).forEach(file => {
          html += `<img src="${file.url}" class="fl-listing-image my-1 mr-1"/>`
        })
        break;
      default:
        html = doc;
    };
    return html;
  }

  public formatDocument(doc: Record<string, any>, fields: any[]) {
    const formattedDoc = {};
    fields.map(field => {
      formattedDoc[field.key] = this.formatField(doc[field.key], field)
    });
    return formattedDoc;

  }

  public formatDocuments(docs: Record<string, any>[], fields: any[]) {
    const formatted = docs.map(doc => ({ id: doc.id, ...this.formatDocument(doc, fields) }));
    console.log(formatted);
    return formatted;
  }

  public async getOverviewFields(schemaName: string) {
    const fields = schemaName ? await this.flamelink.schemas.getFields({
      schemaKey: schemaName,
    }) : null;
    if (fields) {
      return fields.filter(field => field.show);
    }
    return [];
  }

  public getSchemaAutoForm(schema: string) {

    return this.flamelink.angularFire
      .collection('fl_schemas', q => q.where('id', '==', schema))
      .valueChanges()
      .pipe(
        map((result: any) => result && result[0] && result[0].fields),
        map((result: any) => result && result.map(field => ({ ...field, localized: this.settings.localized && this.settings.localized + '.SCHEMAS.' + schema, schema }))),
        switchMap((fields: any) => {
          return this.flSchemaToAutoForm(fields || []);
        })
      );

  }

  public flSchemaToAutoForm(fields: any[]) {

    const fieldWidgets = fields
      .map((field) => {

        const localized = field.localized + '.' + field.key;

        const languageChange = localized
          ? this.settings.languageChanges.pipe(switchMap(() => this.translate.get(localized)))
          : new Observable(observer => observer.next())

        return languageChange.pipe(
          map(

            translation => {
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

              if (['fieldset', 'select', 'repeater'].indexOf(field.type) >= 0) {
                field.options = (field.options || []).map(option => ({
                  ...option,
                  schema: field.schema,
                  localized: field.localized + '.' + field.key,
                }))
              }

              field.name = field.key;
              field.label = localized && translation && translation.title || field.title;
              field.description = localized && translation && translation.description || field.description;
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
                  params: { field }
                });
              };

              return widget;
            }
          )
        )

      });

    return combineLatest(fieldWidgets);

  }

}
