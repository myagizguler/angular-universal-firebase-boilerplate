import { DocumentReference } from '@angular/fire/firestore';

export interface FireDate {
	nanoseconds: number;
	seconds: number;
}

export interface FLMeta {
	createdBy: string;
	createdDate: FireDate;
	docId: string;
	env: string;
	fl_id: string;
	lastModifiedBy: string;
	lastModifiedDate: FireDate;
	locale: string;
	schema: string;
	schemaRef: DocumentReference;
	schemaType: string;
}

export interface FLDocument {
	id: string;
	_fl_meta_: FLMeta;
}
