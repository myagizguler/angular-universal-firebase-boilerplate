
export const FL_CONTENT_WIDGETS = {
    FLDocumentSaveButton: 'FLDocumentSaveButton',
    FLDocumentDeleteButton: 'FLDocumentDeleteButton',
    FLDocumentFormButton: 'FLDocumentFormButton',
    FLDocumentForm: 'FLDocumentForm',
    FLSingleForm: 'FLSingleForm',
    FLCollectionLoadMoreButton: 'FLCollectionLoadMoreButton',
    FLCollectionList: 'FLCollectionList',
    FLDocumentCard: 'FLDocumentCard',
}
export const FL_FIELDS_WIDGETS = {
    FLFieldLocation: 'FLFieldLocation',
    FLFieldMarkdown: 'FLFieldMarkdown',
    FLFieldMedia: 'FLFieldMedia',
    FLFieldSelectRelational: 'FLFieldSelectRelational',
    FLFieldSelect: 'FLFieldSelect',
    FLFieldRepeater: 'FLFieldRepeater',
    FLRepeaterCard: 'FLRepeaterCard',
    FLRepeaterDeleteButton: 'FLRepeaterDeleteButton',
    FLRepeaterFormButton: 'FLRepeaterFormButton',
    FLRepeaterForm: 'FLRepeaterForm',
    FLRepeaterSaveButton: 'FLRepeaterSaveButton',
    FLForm: 'FLForm',
    FLFieldText: 'FLFieldText',
    FLMarkdown: 'FLMarkdown',
    FLFileInput: 'FLFileInput',
    FLFileCard: 'FLFileCard',
    FLFieldDate: 'FLFieldDate',
    FLFieldBoolean: 'FLFieldBoolean',
    FLFieldRadio: 'FLFieldRadio',
};

export const FL_PERMISSIONS_WIDGETS = {
    FLPermissionsList: 'FLPermissionsList',
    FLPermissionCard: 'FLPermissionCard',
    FLPermissionsFormButton: 'FLPermissionsFormButton',
    FLPermissionsForm: 'FLPermissionsForm',
    FLPermissionSaveButton: 'FLPermissionSaveButton'
};


export const FL_USERS_WIDGETS = {
    FLUsersList: 'FLUsersList',
    FLUserCard: 'FLUserCard',
    FLUsersFormButton: 'FLUsersFormButton',
    FLUsersForm: 'FLUsersForm',
    FLUsersSaveButton: 'FLUsersSaveButton'
};

export const FL_WIDGETS = {
    ...FL_CONTENT_WIDGETS,
    ...FL_PERMISSIONS_WIDGETS,
    ...FL_USERS_WIDGETS,
    ...FL_FIELDS_WIDGETS
}