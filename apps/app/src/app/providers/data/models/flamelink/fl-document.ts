import { DocumentReference } from '@angular/fire/firestore';

export interface FLMeta {
	createdBy?: string;
	createdDate?: firebase.firestore.Timestamp;
	docId?: string;
	env?: string;
	fl_id?: string;
	lastModifiedBy?: string;
	lastModifiedDate?: firebase.firestore.Timestamp;
	locale?: string;
	schema?: string;
	schemaRef?: DocumentReference;
	schemaType?: string;
}

export interface FLDocument {
	id?: string;
	order?: number;
	_fl_meta_?: FLMeta;
}
