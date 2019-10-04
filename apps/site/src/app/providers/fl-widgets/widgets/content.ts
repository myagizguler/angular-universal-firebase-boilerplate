import { Injectable } from '@angular/core';
import { Widgets, FormWidget, Widget } from 'open-dashboard';
import { AngularFlamelink } from 'angular-flamelink';
import { FormGroup } from '@angular/forms';
import { switchMap, map, tap, first } from 'rxjs/operators';
import { ReplaySubject, combineLatest, Observable } from 'rxjs';
import { FLContentService } from '../utils/content.service';
import { FL_WIDGETS } from './index';
import { FLSettingsService } from '../utils/settings.service';


@Injectable({
    providedIn: 'root'
})
export class FLContentWidgets {

    constructor(
        private flamelink: AngularFlamelink,
        private settings: FLSettingsService,
        private flContent: FLContentService
    ) { }

    public get(): Widgets {
        return {
            FLSideMenuButton: ({ schema }) => schema && ({
                type: 'button',
                title: schema.title,
                navigate: { commands: ['/', this.settings.routePrefix, schema.type, schema.id] }

            }),
            FLSideMenu: {
                type: 'repeater',
                value: this.flamelink.angularFire.collection('fl_schemas', q => q.where('enabled', '==', true)).valueChanges(),
                widget: (row) => ({
                    widget: 'FLSideMenuButton',
                    params: { schema: row.data }
                })
            },

            // FORM

            FLDocumentSaveButton: ({ schema, id, formGroup, onSave, onSubmit, title }) => ({
                type: 'button',
                title: title || 'Save',
                style: 'raised-button',
                color: 'primary',
                popupClose: true,
                // disabled: !valid,
                submit: true,
                action: async () => {
                    console.log(formGroup.valid, formGroup);
                    if (onSubmit && !onSubmit(formGroup.value)) {
                        return;
                    }
                    // return;
                    const saveData: any = id
                        ? await this.flamelink.content.update({ schemaKey: schema, entryId: id, data: formGroup.value })
                        : await this.flamelink.content.add({ schemaKey: schema, data: formGroup.value });
                    if (onSave) {
                        onSave(saveData);
                    }

                }

            }),
            FLDocumentDeleteButton: ({ schema, id, docTitle, onDelete }) => ({
                type: 'button',
                title: 'Remove',
                color: 'warn',
                icon: 'remove',
                popupClose: true,
                action: async () => {
                    const confirmation = confirm(`Are you sure you want to remove ${docTitle || 'this item'}?`);
                    if (confirmation) {
                        await this.flamelink.content.remove({ schemaKey: schema, entryId: id });
                        if (onDelete) {
                            onDelete();
                        }
                    }
                }

            }),
            FLDocumentFormButton: ({ schema, id }) => ({
                type: 'button',
                cssClass: 'mx-3',
                title: id ? '' : 'Create',
                icon: id ? 'edit' : 'add',
                style: id ? 'button' : 'raised-button',
                popup: {
                    widget: FL_WIDGETS.FLDocumentForm,
                    params: { schema, id }
                }
            }),
            FLDocumentForm: async ({ schema, id, onSave, onSubmit, onDelete, saveLabel }) => {
                const buttons: any[] = [
                    (formGroup: FormGroup) => ({
                        widget: FL_WIDGETS.FLDocumentSaveButton,
                        params: { schema, id, formGroup, onSave, onSubmit, title: saveLabel }
                    }),
                ];

                if (id) {
                    buttons.unshift({
                        widget: FL_WIDGETS.FLDocumentDeleteButton,
                        params: { schema, id, onDelete },
                    });
                }


                const fields = schema ? this.flContent.getSchemaAutoForm(schema) : [];
                // const linkedFields = fields.filter(field => !!field.linkedField);

                return ({
                    type: 'form',
                    fields,
                    value: id ? this.settings.languageChanges.pipe(
                        switchMap(lang =>
                            this.flamelink.angularFire
                                .collection(
                                    'fl_content',
                                    q => q.where('_fl_meta_.schema', '==', schema).where('_fl_meta_.fl_id', '==', id).where('_fl_meta_.locale', '==', lang))
                                .valueChanges().pipe(map(result => {
                                    return result && result[0];
                                }))
                        )
                    ) : {},
                    buttons,
                    // onChange: (form) => {
                    //     linkedFields.forEach(field => {
                    //         const newValue = { ...form.value };
                    //         newValue[field.name] = form.value[field.linkedField];
                    //         form.setValue(newValue, { emitEvent: false });
                    //     });
                    // }
                }) as FormWidget;
            },
            FLSingleForm: async ({ schema }) => {
                const doc = await this.flamelink.content.get({ schemaKey: schema });
                const id = doc ? doc.id : null;
                return ({
                    type: 'form',
                    fields: schema ? this.flContent.getSchemaAutoForm(schema) : [],
                    value: this.settings.languageChanges.pipe(switchMap(() => this.flamelink.valueChanges<any>({
                        schemaKey: schema, entryId: null
                    }))),
                    buttons: [
                        form => ({
                            widget: FL_WIDGETS.FLDocumentSaveButton,
                            params: { data: form.value, schema, id, valid: form.valid }
                        })
                    ]
                }) as FormWidget;
            },


            // LISTING

            FLCollectionLoadMoreButton: ({ limitChange, count }) => ({
                type: 'button',
                title: 'Load more',
                action: () => {
                    count.total += 20;
                    limitChange.next(count.total);
                }
            }),

            FLCollectionExport: ({ schema }) => ({
                type: 'button',
                cssClass: 'mx-3',
                title: 'Export CSV',
                action: async () => {

                    const data = await this.flamelink.valueChanges({ schemaKey: schema, populate: true }).pipe(first()).toPromise();
                    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
                    const header = Object.keys(data[0]).filter(key => key !== '_fl_meta_');
                    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer).replace(/,/g, '-')).join(','));
                    csv.unshift(header.join(','));
                    let csvArray = csv.join('\r\n');

                    var a = document.createElement('a');
                    var blob = new Blob([csvArray], { type: 'text/csv' }),
                        url = window.URL.createObjectURL(blob);

                    a.href = url;
                    a.download = schema + '.csv';
                    a.click();
                    window.URL.revokeObjectURL(url);
                    a.remove();


                }
            }),
            FLCollectionList: ({ schema }) => {

                const limitChange = new ReplaySubject<number>();
                const count = { total: 20 };
                limitChange.next(20);

                return {
                    type: 'layout',
                    containerClass: 'p-0 fl-collection-listing-wrapper',
                    cols: [
                        {
                            colClass: 'col-6',
                            widget: FL_WIDGETS.FLDocumentFormButton,
                            params: { schema }
                        },
                        {
                            colClass: 'col-6 text-right',
                            widget: 'FLCollectionExport',
                            params: { schema }
                        },
                        {},
                        {
                            colClass: 'col-12 pb-4',
                            widget: 'FLCollectionFiltersReader',
                            params: { schema, limitChange }
                        },
                        {
                            colClass: 'col-12 text-center pb-4',
                            widget: FL_WIDGETS.FLCollectionLoadMoreButton,
                            params: { limitChange, count }
                        },

                    ]
                } as Widget;
            },
            FLCollectionFiltersReader: ({ schema, limitChange }) => ({
                type: 'params-reader',
                widget: (segments, params) => ({
                    widget: 'FLCollectionTable',
                    params: { schema, segments, params, limitChange }
                })
            }),
            FLCollectionTable: ({ schema, segments, params, limitChange }) => {

                limitChange = limitChange || Promise.resolve(null);

                const queryOptions: any = {
                    schemaKey: schema,
                    orderBy: {
                        field: '_fl_meta_.createdDate',
                        order: 'desc',
                    },
                    populate: [],
                    startAt: 0,
                };

                const cols = new ReplaySubject<any>();
                this.flContent.getOverviewFields(schema).then(fields => {
                    queryOptions.fields = ['id', ...fields.map(field => field.key)]
                    return (fields || []).map(field => {
                        queryOptions.populate.push(field.key);
                        return ({
                            ...field,
                            label: field.title
                        });
                    });
                }).then(_cols => cols.next(_cols));

                const value = combineLatest(
                    this.settings.languageChanges,
                    cols,
                    limitChange
                ).pipe(
                    switchMap(([lang, cols, limit]) => {
                        return this.flamelink.valueChanges<any>({
                            ...queryOptions,
                            limit
                        }).pipe(map(docs => ({ cols, docs })));
                    }
                    ),
                    map(({ cols, docs }) => this.flContent.formatDocuments(docs, cols))
                )

                return {
                    type: 'mat-table',
                    cols,
                    value,
                    rowButtons: [
                        (row) => ({
                            widget: FL_WIDGETS.FLDocumentFormButton,
                            params: { schema, id: row.data.id }
                        })
                    ]
                };
            },

            // Top Menu
            FLTopMenu: {
                type: 'repeater',
                value: [
                    { title: 'Content' },
                    { settings: 'users', title: 'Users' },
                    { settings: 'permissions', title: 'Permissions' },
                ],
                widget: row => ({
                    widget: 'FLMenuButton',
                    params: row.data
                })
            },
            FLMenuButton: ({ title, settings }) => ({
                type: 'button',
                title,
                navigate: {
                    commands: [],
                    extras: {
                        queryParams: settings
                            ? {
                                settings,
                                title
                            }
                            : {}
                    }
                }
            }),

        };
    }


}
