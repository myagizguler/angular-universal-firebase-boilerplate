import { Injectable } from '@angular/core';
import { Widgets } from 'open-dashboard';
import { map } from 'rxjs/operators';
import { AngularFlamelink } from 'angular-flamelink';



@Injectable({
    providedIn: 'root'
})
export class FLUsersWidgets {

    constructor(
        private flamelink: AngularFlamelink
    ) { }

    public get(): Widgets {
        return {
            FLUsersList: {
                type: 'repeater',
                value: this.flamelink.angularFire.collection('fl_users').valueChanges(),
                widget: (row, list) => ({
                    widget: 'FLUserCard',
                    params: { title: row.data.displayName, id: row.data.id }
                }),
                buttons: [
                    {
                        widget: 'FLUsersFormButton',
                    }
                ]
            },
            FLUserCard: ({ title, id }) => ({
                type: 'card',
                title,
                cssClass: 'my-3',
                buttons: [
                    {
                        widget: 'FLUsersFormButton',
                        params: { id }
                    }
                ]
            }),
            FLUsersFormButton: ({ id }) => ({
                type: 'button',
                title: id ? 'Update' : 'New User',
                style: id ? 'flat-button' : 'raised-button',
                icon: id ? 'edit' : 'add',
                popup: {
                    widget: 'FLUsersForm',
                    params: { id }
                }
            }),
            FLUsersForm: ({ id }) => ({
                type: 'form',
                value: id ? this.flamelink.angularFire.collection('fl_users').doc(id).valueChanges() : {},
                fields: [
                    { name: 'displayName', label: 'Display Name', type: 'text-input', required: true },
                    { name: 'email', label: 'Email', type: 'text-input', required: true, },
                    { name: 'password', label: 'Password', type: 'password-input', required: true, hidden: !!id },
                    { name: 'firstName', label: 'First Name', type: 'text-input' },
                    { name: 'lastName', label: 'Last Name', type: 'text-input' },
                    {
                        name: 'permissions', label: 'Permissions', type: 'select-input',
                        options: this.flamelink.angularFire.collection<any>('fl_permissions').valueChanges().pipe(map(profiles => profiles.map(profile => ({
                            value: this.flamelink.angularFire.collection('fl_permissions').doc(profile.id).ref, label: profile.name
                        })))),
                        compare: (option, selection) => (option.id === selection.id)
                    },
                    {
                        name: 'enabled', label: 'Enabled', type: 'select-input', options: [
                            { label: 'Yes', value: 'Yes' },
                            { label: 'No', value: 'No' },
                        ]
                    },
                ],
                buttons: [
                    form => ({
                        widget: 'FLUsersSaveButton',
                        params: { id, data: form.value }
                    })
                ]

            }),
            FLUsersSaveButton: ({ id, data }) => ({
                type: 'button',
                title: id ? 'Update User' : 'Create User',
                cssClass: 'mt-5',
                color: 'primary',
                style: 'raised-button',
                popupClose: true,
                action: () => {
                    const password = data.password;
                    delete data.password;
                    return id
                        ? this.flamelink.angularFire.collection('fl_users').doc(id).update(data)
                        : this.flamelink.auth.auth.createUserWithEmailAndPassword(data.email, password).then(
                            credentials => this.flamelink.users.addToDB({
                                uid: credentials.user.uid,
                                data
                            })
                        );
                }
            })

        };
    }


}
