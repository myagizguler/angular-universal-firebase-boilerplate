import { Injectable } from '@angular/core';
import { Widgets, FormWidget, Widget } from 'open-dashboard';
import { AngularFlamelink } from 'angular-flamelink';
import { FormGroup } from '@angular/forms';
import { switchMap, map } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
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

            FLCollectionLoadMoreButton: ({ limitObservable, limit }) => ({
                type: 'button',
                title: 'Load more',
                action: () => {
                    limitObservable.next(limit);
                }
            }),

            FLCollectionList: async ({ schema, limit }) => {
                const queryOptions: any = {
                    schemaKey: schema,
                    orderBy: {
                        field: '_fl_meta_.createdDate',
                        order: 'desc',
                    },
                };

                const limitObservable = new ReplaySubject<number>();
                if (limit) {
                    queryOptions.startAt = 0;
                }


                const tabelCols = await this.flContent.getOverviewFields(schema).then(fields => {
                    queryOptions.fields = ['id', ...fields.map(field => field.key)]
                    queryOptions.populate = true;
                    return (fields || []).map(field => ({
                        ...field,
                        label: field.title
                    }));
                });


                let count = 0;
                limitObservable.next(limit);

                return {
                    type: 'layout',
                    containerClass: 'p-0 fl-collection-listing-wrapper',
                    cols: this.settings.languageChanges.pipe(
                        switchMap(() => limitObservable),
                        switchMap($limit => this.flamelink.valueChanges<any>({
                            ...queryOptions,
                            limit: $limit
                        })),
                        switchMap(async (documents) => {
                            count = documents.length;
                            return [
                                {
                                    colClass: 'col-12 text-right',
                                    widget: FL_WIDGETS.FLDocumentFormButton,
                                    params: { schema }
                                },
                                {
                                    colClass: 'col-12 pb-4',
                                    widget: 'FLCollectionTable',
                                    params: { schema, value: this.flContent.formatDocuments(documents, tabelCols), cols: tabelCols }
                                },
                                {
                                    colClass: 'col-12 text-center pb-4',
                                    widget: FL_WIDGETS.FLCollectionLoadMoreButton,
                                    params: { limitObservable, limit: count + limit }
                                },

                            ];
                        })
                    )
                } as Widget;
            },
            FLCollectionTable: ({ schema, value, cols }) => ({
                type: 'mat-table',
                cols,
                value,
                rowButtons: [
                    (row) => ({
                        widget: FL_WIDGETS.FLDocumentFormButton,
                        params: { schema, id: row.data.id }
                    })
                ]


            }),
            FLDocumentCard: ({ schema, id, title, image, subtitle }) => ({
                type: 'card',
                title,
                avatar: image,
                subtitle,
                buttons: [
                    {
                        widget: FL_WIDGETS.FLDocumentFormButton,
                        params: { schema, id }
                    }
                ]
            }),


        };
    }


}
