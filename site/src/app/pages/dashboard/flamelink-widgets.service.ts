import { Injectable } from '@angular/core';
import { AngularFlamelink } from 'angular-flamelink';
import { switchMap, map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { DocumentReference } from '@angular/fire/firestore';
import {
	WidgetLinker, Widgets, FormWidget, SelectInputWidget, TextInputWidget, DateInputWidget,
	RepeaterWidget, MarkdownEditorWidget, CardWidget
} from 'open-dashboard';
import { FormGroup } from '@angular/forms';
import { RepeaterList } from 'open-dashboard/lib/widgets/data/repeater/repeater.component';

export const FL_WIDGETS = {
	FLMarkdown: 'FLMarkdown',
	FLDocumentSaveButton: 'FLDocumentSaveButton',
	FLDocumentDeleteButton: 'FLDocumentDeleteButton',
	FLDocumentFormButton: 'FLDocumentFormButton',
	FLDocumentForm: 'FLDocumentForm',
	FLDocumentCard: 'FLDocumentCard',
	FLCollectionList: 'FLCollectionList',
	FLRepeaterCard: 'FLRepeaterCard',
	FLRepeaterDeleteButton: 'FLRepeaterDeleteButton',
	FLRepeaterFormButton: 'FLRepeaterFormButton',
	FLRepeaterForm: 'FLRepeaterForm',
	FLRepeaterSaveButton: 'FLRepeaterSaveButton',
	FLFileInput: 'FLFileInput',
	FLFileCard: 'FLFileCard',
};

@Injectable({
	providedIn: 'root'
})
export class FlamelinkWidgets {

	private settings: FLDashboardSettings = {
		languageObservable: new Observable(observer => {
			observer.next();
		})
	};

	public get defaultWidgets(): Widgets {
		return {
			FLMarkdown: ({ content }) => ({
				type: 'markdown',
				content
			}),
			FLDocumentSaveButton: ({ schema, id, data, valid }) => ({
				type: 'button',
				title: 'Save',
				style: 'raised-button',
				color: 'primary',
				popupClose: true,
				disabled: !valid,
				action: () => {
					valid = false;
					// console.log(schema, id, data);
					id
						? this.flamelink.content.update({ schemaKey: schema, entryId: id, data })
						: this.flamelink.content.add({ schemaKey: schema, data });
				}

			}),
			FLDocumentDeleteButton: ({ schema, id, docTitle }) => ({
				type: 'button',
				title: 'Remove',
				color: 'warn',
				icon: 'remove',
				popupClose: true,
				action: () => {
					const confirmation = confirm(`Are you sure you want to remove ${docTitle || 'this item'}?`);
					if (confirmation) {
						this.flamelink.content.remove({ schemaKey: schema, entryId: id });
					}
				}

			}),
			FLDocumentFormButton: ({ schema, id }) => ({
				type: 'button',
				title: id ? 'Update' : 'Create',
				icon: id ? 'edit' : 'add',
				style: id ? 'button' : 'raised-button',
				popup: {
					widget: FL_WIDGETS.FLDocumentForm,
					params: { schema, id }
				}
			}),
			FLDocumentForm: ({ schema, id }) => {
				const buttons: any[] = [
					(form: FormGroup) => ({
						widget: FL_WIDGETS.FLDocumentSaveButton,
						params: { schema, id, data: form.value, valid: form.valid }
					}),
				];

				if (id) {
					buttons.unshift({
						widget: FL_WIDGETS.FLDocumentDeleteButton,
						params: { schema, id },
					});
				}

				return ({
					type: 'form',
					fields: schema ? this.getSchemaAutoForm(schema) : [],
					value: id ? this.settings.languageObservable.pipe(
						switchMap(() => this.flamelink.valueChanges({ schemaKey: schema, entryId: id }))
					) : {},
					buttons
				});
			},
			FLCollectionList: ({ schema, layout }) => ({
				type: 'layout',
				containerClass: 'p-0',
				cols: this.settings.languageObservable.pipe(
					switchMap(() => this.flamelink.valueChanges<any>({ schemaKey: schema }).pipe(switchMap(async members => {
						const fields = await this.getOverviewFields(schema);
						return [
							{
								colClass: 'col-12 text-right',
								widget: FL_WIDGETS.FLDocumentFormButton,
								params: { schema }
							},
							...members.map(document => ({
								widget: FL_WIDGETS.FLDocumentCard,
								colClass: (layout === 'list' ? 'col-12' : 'col-6') + ' py-3',
								params: {
									schema,
									id: document.id,
									title: document[fields[0]] || '',
									image: document.imageUrl,
									subtitle: document[fields[1]] || ''
								}
							}))
						];
					})))
				),


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

			// Repeater
			FLRepeaterCard: ({ row, title, fields }) => ({
				type: 'card',
				cssClass: 'pb-3',
				title,
				buttons: [
					({
						widget: FL_WIDGETS.FLRepeaterDeleteButton,
						params: { row }
					}),
					({
						widget: FL_WIDGETS.FLRepeaterFormButton,
						params: { row, fields }
					})
				]
			}),
			FLRepeaterDeleteButton: ({ row }) => ({
				type: 'button',
				title: 'Remove',
				icon: 'remove',
				action: () => {
					row.remove();
				}
			}),
			FLRepeaterFormButton: ({ row, list, fields }) => ({
				type: 'button',
				title: row ? 'Update' : 'Add',
				icon: row ? 'edit' : 'add',
				style: row ? 'button' : 'raised-button',
				popup: {
					widget: FL_WIDGETS.FLRepeaterForm,
					params: { row, list, fields }
				},


				// action: () => {
				// 	row.update({ description: 'test' });
				// }
			}),
			FLRepeaterForm: ({ row, list, fields }) => ({
				type: 'form',
				fields,
				value: row ? row.data : {},
				buttons: [
					form => ({
						widget: FL_WIDGETS.FLRepeaterSaveButton,
						params: { row, list, data: form.value }
					})
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

			// Files
			FLFileInput: ({ onChange }) => ({
				type: 'file-input',
				icon: 'cloud_upload',
				onChange,
				label: 'Upload...',
			}),
			FLFileCard: async ({ row }) => {
				let image: string;
				let content: string;

				if (row) {
					image = row.data.imageUrl;
					content = row.data.label;
					if (row.data.id) {
						image = await this.flamelink.storage.getURL({ fileId: row.data.id });
						content = await this.flamelink.storage.getFile({ fileId: row.data.id }).then(file => file.file + ' (' + file.contentType + ')');
					}
				}
				// console.log(image);

				return ({
					type: 'card',
					cssClass: 'pb-3',
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

	public widgets(settings?: FLDashboardSettings) {
		if (settings) {
			this.settings = {
				...this.settings,
				...settings
			};
		}
		return {
			...this.defaultWidgets
		};
	}


	constructor(
		private flamelink: AngularFlamelink
	) { }

	public async getOverviewFields(schemaName: string) {
		const fields = schemaName ? await this.flamelink.schemas.getFields({
			schemaKey: schemaName,
		}) : null;
		if (fields) {
			return fields.filter(field => field.show && field.type === 'text').map(field => field.key);
		}
		return [];
	}

	public async getSchemaAutoForm(schemaName: string) {
		// console.log(schemaName);
		const fields = await this.flamelink.schemas.getFields({
			schemaKey: schemaName,
		});
		if (fields) {
			return this.flSchemaToAutoForm(fields);
		}
		return null;
	}

	public flSchemaToAutoForm(fields: any[]) {
		// console.log(schemaStructure);
		return fields
			.filter(field => !field.hidden)
			.map(field => {


				const fieldStructure: any = {
					...field,
					type: 'text-input',
					name: field.key,
					label: field.title,
					value: field.defaultValue || ''
				};

				const rules: any[] = field.constraints || [];

				rules.forEach(rule => {
					if (rule.rule === 'presence' && !rule.allowEmpty) {
						fieldStructure.required = true;
					}
				});

				switch (field.type) {

					case 'fieldset':
						const formWidget: FormWidget = fieldStructure;
						formWidget.type = 'form';
						formWidget.fieldClass = 'py-3';
						formWidget.fields = this.flSchemaToAutoForm(field.options);
						break;

					case 'text':
						const textInputWidget: TextInputWidget = fieldStructure;
						textInputWidget.type = 'text-input';
						break;

					case 'date':
						const dateInputWidget: DateInputWidget = fieldStructure;
						dateInputWidget.type = 'date-input';
						break;

					case 'repeater':
						const repeaterWidget: RepeaterWidget = fieldStructure;
						repeaterWidget.type = 'repeater';
						repeaterWidget.buttons = [
							(list) => ({
								widget: FL_WIDGETS.FLRepeaterFormButton,
								params: { list, fields: this.flSchemaToAutoForm(field.options) }
							})
						];
						repeaterWidget.widget = (row) => ({
							widget: FL_WIDGETS.FLRepeaterCard,
							params: {
								row,
								fields: this.flSchemaToAutoForm(field.options),
								title: row.data[field.options.filter(option => option.type === 'text')[0].key]
							}
						});
						break;

					case 'select':
						const selectInputWidget: SelectInputWidget = fieldStructure;

						selectInputWidget.type = 'select-input';
						selectInputWidget.options = fieldStructure.options.map(option => {
							return { value: option.value, label: option.label };
						});

						break;

					case 'select-relational':
						const selectRelationalInputWidget: SelectInputWidget = fieldStructure;

						selectRelationalInputWidget.type = 'select-input';
						selectRelationalInputWidget.options = this.flamelink.valueChanges<{ id: string }>({
							schemaKey: field.relation
						}).pipe(
							map(documents => documents.map(document => {
								return { value: this.flamelink.ref(document.id), label: document[field.relationalFieldsToShow[0]] };
							}))
						);

						selectRelationalInputWidget.compare = (option, selection) => option.id === selection.id;
						break;

					case 'media':

						const fileInputWidget: RepeaterWidget = fieldStructure;
						fileInputWidget.type = 'repeater';
						fileInputWidget.widget = (row) => {
							return {
								widget: FL_WIDGETS.FLFileCard,
								params: { row }
							};
						};
						fileInputWidget.buttons = new Observable(observer => {

							const buttons = (): (WidgetLinker | ((list: RepeaterList) => WidgetLinker))[] => ([
								(list) => ({
									widget: FL_WIDGETS.FLFileInput,
									params: {
										onChange: (filelist: FileList) => {

											const watchFiles = [];
											for (let i = 0; i < filelist.length; i++) {
												watchFiles.push(filelist.item(i));
											}

											const observables = watchFiles.map(file => this.uploadFile(file));

											combineLatest(observables).subscribe(
												pendingFiles => {
													list.value
														? list.set(list.value.filter(rowData => !!rowData.id))
														: list.set([]);
													list.add(pendingFiles);
													observer.next(buttons());
												},
												error => { },
												() => {
													list.value
														? list.set(list.value.map(rowData => {
															if (rowData.value) {
																return rowData.value;
															}
															return rowData;
														}))
														: list.set([]);

												}
											);


										}
									}
								})
							]);
							observer.next(buttons());

						});
						break;


					case 'markdown-editor':
						const markdownEditor: MarkdownEditorWidget = fieldStructure;
						markdownEditor.type = 'markdown-editor';
						markdownEditor.height = '100px';
						markdownEditor.hideIcons = ['Ul', 'Ol', 'Code', 'TogglePreview', 'FullScreen', 'Image'];

						break;
				}


				return fieldStructure;
			});
	}

	public uploadFile(file: File) {

		return new Observable<ProgressFile>(observer => {

			const data: ProgressFile = {
				label: 'Uploading: ' + file.name + '(' + file.size + ')',
				imageUrl: null,
				value: null,
			};
			observer.next(data);

			if (file.type.indexOf('image') === 0) {
				this.getBlob(file).then(blob => {
					data.imageUrl = blob,
						observer.next(data);
				});
			}
			this.flamelink.storage.upload(file, {}).then(
				success => {
					data.progress = 100;
					data.value = this.flamelink.storage.fileRef(success.id);
					observer.next(data);
					observer.complete();
				},
				error => {
					observer.error(error);
					observer.complete();
				}
			);


		});

	}

	public getBlob(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader();
			fileReader.onload = (event) => {
				// tslint:disable-next-line:no-string-literal
				resolve(event.target['result']);
			};
			fileReader.readAsDataURL(file);

		});
	}

}

export interface ProgressFile {
	label?: string;
	imageUrl?: string;
	value?: DocumentReference;
	progress?: number;
}

export interface FLDashboardSettings {
	languageObservable?: Observable<any>;
}
