import { Injectable } from '@angular/core';
import { Widgets, Widget } from 'open-dashboard';
import { AngularFlamelink } from 'angular-flamelink';



@Injectable({
    providedIn: 'root'
})
export class FLPermissionsWidgets {

    constructor(
        private flamelink: AngularFlamelink
    ) { }

    public get(): Widgets {
        return {
            FLPermissionsList: {
                type: 'repeater',
                value: this.flamelink.angularFire.collection('fl_permissions').valueChanges(),
                widget: (row, list) => ({
                    widget: 'FLPermissionCard',
                    params: { title: row.data.name, id: row.data.id }
                }),
                buttons: [
                    {
                        widget: 'FLPermissionsFormButton',
                    }
                ]
            },
            FLPermissionCard: ({ title, id }) => ({
                type: 'card',
                title,
                cssClass: 'my-3',
                buttons: [
                    {
                        widget: 'FLPermissionsFormButton',
                        params: { id }
                    }
                ]
            }),
            FLPermissionsFormButton: ({ id }) => ({
                type: 'button',
                title: id ? 'Update' : 'New Permissions Profile',
                style: id ? 'flat-button' : 'raised-button',
                icon: id ? 'edit' : 'add',
                popup: {
                    widget: 'FLPermissionsForm',
                    params: { id }
                }
            }),
            FLPermissionsForm: ({ id }) => ({
                type: 'form',
                value: id ? this.flamelink.angularFire.collection('fl_permissions').doc(id).valueChanges() : {},
                fields: this.flamelink.schemas.get().then((schemas: { [key: string]: any }) => {
                    const toggles: Widget[] = [
                        { type: 'slide-toggle', name: 'view', label: 'View' },
                        { type: 'slide-toggle', name: 'create', label: 'Create' },
                        { type: 'slide-toggle', name: 'update', label: 'Update' },
                        { type: 'slide-toggle', name: 'delete', label: 'Delete' },
                    ];
                    const fields: Widget[] = [
                        { type: 'text-input', name: 'name', label: 'Name', required: true },
                        { type: 'form', name: 'users', label: 'Manage Users', fields: toggles },
                        { type: 'form', name: 'permissions', label: 'Manage Permissions', fields: toggles },
                        { type: 'form', name: 'media', label: 'Manage Media', fields: toggles },
                        {
                            type: 'form', name: 'schemas', label: 'Manage Schemas', fields: [
                                { type: 'form', name: 'production', label: '', fields: toggles }
                            ]
                        },
                        {
                            type: 'form', name: 'content', label: 'Manage Content', fields: [
                                {
                                    type: 'form', name: 'production', label: '', fields: Object.keys(schemas).map(key => {
                                        return {
                                            type: 'form', name: key, label: schemas[key].title, fields: toggles
                                        } as Widget;
                                    })
                                }
                            ]
                        },
                        {
                            type: 'form', name: 'settings', label: '', fields: [
                                { type: 'form', name: 'environments', label: 'Manage Environments', fields: toggles },
                                { type: 'form', name: 'locales', label: 'Manage Locales', fields: toggles },
                                { type: 'form', name: 'general', label: 'General', fields: toggles },
                                { type: 'form', name: 'globals', label: 'Globals', fields: toggles },
                                { type: 'form', name: 'backups', label: 'Backups', fields: toggles },
                                { type: 'form', name: 'workflows', label: 'Workflows', fields: toggles },
                            ]
                        },
                        {
                            type: 'form', name: 'navigation', label: 'Navigation', fields: [
                                { type: 'form', name: 'production', label: '', fields: toggles }
                            ]
                        },

                    ];
                    return fields;
                }),
                buttons: [
                    form => ({
                        widget: 'FLPermissionSaveButton',
                        params: { id, data: form.value }
                    })
                ]
            }),
            FLPermissionSaveButton: ({ id, data }) => ({
                type: 'button',
                title: id ? 'Update Permissions' : 'Create Profile',
                cssClass: 'mt-5',
                color: 'primary',
                style: 'raised-button',
                popupClose: true,
                action: () => {
                    // console.log(id, data);
                    id
                        ? this.flamelink.angularFire.collection('fl_permissions').doc(id).update(data)
                        : this.flamelink.angularFire.collection('fl_permissions').add(data).then(documentRef => {
                            documentRef.update({
                                id: documentRef.id
                            });
                        });
                }
            })
        };

    }


}
