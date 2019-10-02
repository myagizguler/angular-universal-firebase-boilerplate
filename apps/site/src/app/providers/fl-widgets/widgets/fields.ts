import { Injectable } from '@angular/core';
import { Widgets, CardWidget, WidgetLinker, RepeaterList } from 'open-dashboard';
import { AngularFlamelink } from 'angular-flamelink';
import { FL_WIDGETS } from './index';
import { FLContentService } from '../utils/content.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { FLMediaService } from '../utils/media.service';
import { FLSettingsService } from '../utils/settings.service';
import { TranslateService } from '@ngx-translate/core';
import { countries } from '../utils/countries.object';

@Injectable({
    providedIn: 'root'
})
export class FLFieldsWidgets {

    constructor(
        private flamelink: AngularFlamelink,
        private flContent: FLContentService,
        private flSettings: FLSettingsService,
        private translate: TranslateService,
        private flMedia: FLMediaService
    ) { }

    public get(): Widgets {
        return {
            FLForm: ({ field }) => field && ({
                ...field,
                type: 'form',
                fieldClass: 'py-3',
                fields: this.flContent.flSchemaToAutoForm(field.options),
            }),
            FLFieldText: ({ field }) => field && ({
                ...field,
                type: 'text-input',
            }),
            FLFieldBoolean: ({ field }) => field && ({
                ...field,
                type: 'slide-toggle',
            }),
            FLFieldRadio: ({ field }) => field && ({
                ...field,
                type: 'radio-input',
                options: this.flSettings.languageChanges.pipe(
                    switchMap(
                        () => field.localized
                            ? this.translate.get(field.localized + '.' + field.key)
                            : Promise.resolve(null)
                    ),
                    map(
                        translations => field.options.map(option => {
                            return {
                                value: option.value, label: translations && translations[option.value] && translations[option.value].title || option.label
                            };
                        })
                    )
                )
            }),
            FLFieldDate: ({ field }) => field && ({
                ...field,
                type: 'date-input',
            }),

            // Repeater
            FLFieldRepeater: ({ field }) => field && ({
                ...field,
                type: 'mat-table',
                cols: this.flSettings.languageChanges.pipe(
                    switchMap(
                        () => field.localized
                            ? this.translate.get(field.localized + '.' + field.key)
                            : Promise.resolve(null)
                    ),
                    map(
                        translations => field.options.map(option => ({
                            key: option.key,
                            label: translations && translations[option.key] && translations[option.key].title || option.label
                        }))

                    )
                ),
                buttons: [
                    (list) => ({
                        widget: FL_WIDGETS.FLRepeaterFormButton,
                        params: { list, fields: this.flContent.flSchemaToAutoForm(field.options) }
                    })
                ],
                rowButtons: [
                    (row) => ({
                        widget: FL_WIDGETS.FLRepeaterDeleteButton,
                        params: { row }
                    }),
                    (row) => ({
                        widget: FL_WIDGETS.FLRepeaterFormButton,
                        params: { row, fields: this.flContent.flSchemaToAutoForm(field.options) }
                    })
                ]

            }),
            // FLFieldRepeaterDeprecated: ({ field }) => field && ({
            //     ...field,
            //     type: 'repeater',
            //     buttons: [
            //         (list) => ({
            //             widget: FL_WIDGETS.FLRepeaterFormButton,
            //             params: { list, fields: this.flContent.flSchemaToAutoForm(field.options) }
            //         })
            //     ],
            //     widget: (row) => {
            //         const titleFields = field.options.filter(option => option.type === 'text' || option.type === 'textarea');
            //         const titleField = titleFields.length && titleFields[0];
            //         return {
            //             widget: FL_WIDGETS.FLRepeaterCard,
            //             params: {
            //                 row,
            //                 fields: this.flContent.flSchemaToAutoForm(field.options),
            //                 title: titleField && row.data[titleField.key]
            //             }
            //         };
            //     }

            // }),
            // FLRepeaterCard: ({ row, title, fields }) => ({
            //     type: 'card',
            //     cssClass: 'my-3',
            //     title,
            //     buttons: [
            //         ({
            //             widget: FL_WIDGETS.FLRepeaterDeleteButton,
            //             params: { row }
            //         }),
            //         ({
            //             widget: FL_WIDGETS.FLRepeaterFormButton,
            //             params: { row, fields }
            //         })
            //     ]
            // }),
            FLRepeaterDeleteButton: ({ row }) => ({
                type: 'button',
                title: '',
                icon: 'remove',
                action: () => {
                    row.remove();
                }
            }),
            FLRepeaterFormButton: ({ row, list, fields }) => ({
                type: 'button',
                // cssClass: 'mt-3',
                title: row ? '' : 'Add',
                icon: row ? 'edit' : 'add',
                style: row ? 'button' : 'raised-button',
                popup: {
                    widget: FL_WIDGETS.FLRepeaterForm,
                    params: { row, list, fields }
                }
            }),
            FLRepeaterForm: ({ row, list, fields }) => ({
                type: 'form',
                fields,
                value: row ? row.data : {},
                buttons: [
                    form => {
                        return ({
                            widget: FL_WIDGETS.FLRepeaterSaveButton,
                            params: { row, list, data: form.value }
                        });
                    }
                ]
            }),
            FLRepeaterSaveButton: ({ row, list, data }) => ({
                type: 'button',
                title: 'Save',
                popupClose: true,
                action: () => {
                    return row ? row.update(data) : list.add(data);
                }
            }),


            FLFieldSelect: ({ field }) => field && ({
                ...field,
                type: 'select-input',
                options: this.flSettings.languageChanges.pipe(
                    switchMap(
                        () => field.localized
                            ? this.translate.get(field.localized + '.' + field.key)
                            : Promise.resolve(null)
                    ),
                    map(
                        translations => field.options.map(option => ({
                            value: option.value,
                            label: translations && translations[option.value] && translations[option.value].title || option.label
                        }))
                    )
                )

            }),
            FLFieldSelectRelational: ({ field }) => field && ({
                ...field,
                type: 'select-input',
                options: (field.relation === 'countries')
                    ? this.flSettings.languageChanges.pipe(map(
                        lang => [
                            { value: '', label: '' },
                            ...countries.map(country => ({
                                value: country.code,
                                label: country[lang]
                            }))
                        ]
                    ))
                    : this.flamelink.valueChanges<{ id: string; _fl_meta_: any; }>({
                        schemaKey: field.relation
                    }).pipe(
                        map(documents => documents.map(document => {
                            return { value: this.flamelink.ref(document.id), label: document[field.relationalFieldsToShow[0]] };
                        }))
                    ),
                compare: (option, selection) => option.id === selection.id

            }),
            FLFieldMedia: ({ field }) => field && ({
                ...field,
                type: 'repeater',
                widget: (row) => {
                    return {
                        widget: FL_WIDGETS.FLFileCard,
                        params: { row }
                    };
                },
                buttons: this.flSettings.languageChanges.pipe(
                    switchMap(
                        () => field.localized
                            ? this.translate.get(field.localized + '.' + field.key)
                            : Promise.resolve(null)
                    ),
                    map(
                        translations => [(list) => {
                            console.log(translations);
                            return ({
                                widget: FL_WIDGETS.FLFileInput,
                                params: {
                                    label: translations && translations.upload || 'Upload',
                                    onChange: (filelist: FileList) => {
                                        const watchFiles = [];
                                        for (let i = 0; i < filelist.length; i++) {
                                            watchFiles.push(filelist.item(i));
                                        }
                                        const observables = watchFiles.map(file => this.flMedia.uploadFile(file, field.schema));
                                        combineLatest(observables).subscribe(pendingFiles => {
                                            const listValue = list.value
                                                ? list.value.filter(rowData => !!rowData.id)
                                                : [];
                                            list.set([...pendingFiles, ...listValue]);
                                        }, error => {
                                            console.log('error', error);
                                        }, () => {
                                            setTimeout(() => {
                                                list.value
                                                    ? list.set(list.value.map(rowData => {
                                                        if (rowData.value) {
                                                            return rowData.value;
                                                        }
                                                        return rowData;
                                                    }))
                                                    : list.set([]);
                                            }, 50);
                                        });
                                    }
                                }
                            });
                        }]

                    )
                )

            }),
            FLFieldMarkdown: ({ field }) => field && ({
                ...field,
                type: 'markdown-editor',
                height: '100px',
                hideIcons: ['Ul', 'Ol', 'Code', 'TogglePreview', 'FullScreen', 'Image'],
            }),
            FLFieldLocation: ({ field }) => field && ({
                ...field,
                type: 'form',
                fields: [
                    {
                        name: 'lat',
                        label: 'Latitude',
                        type: 'text-input',
                    },
                    {
                        name: 'lng',
                        label: 'Longitude',
                        type: 'text-input'
                    }
                ]
            }),

            ////
            FLMarkdown: ({ content }) => ({
                type: 'markdown',
                content
            }),

            // Files
            FLFileInput: ({ onChange, label }) => ({
                type: 'file-input',
                icon: 'cloud_upload',
                cssClass: 'mt-3',
                onChange,
                label
            }),
            FLFileCard: async ({ row }) => {
                let image: string;
                let content: string;

                if (row) {
                    image = row.data.imageUrl;
                    content = row.data.label;
                    if (row.data.id) {
                        image = await this.flamelink.storage.getURL({ fileId: row.data.id });
                        content = await this.flamelink.storage.getFile({ fileId: row.data.id }).then(file => 'Type: ' + file.contentType);
                    }
                }
                // console.log(image);

                return ({
                    type: 'card',
                    cssClass: 'my-3',
                    width: '50%',
                    content,
                    image,
                    buttons: [
                        ({
                            widget: FL_WIDGETS.FLRepeaterDeleteButton,
                            params: { row }
                        })
                    ]
                }) as CardWidget;
            }
        };
    }


}
