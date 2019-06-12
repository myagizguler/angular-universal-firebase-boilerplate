import { DocumentReference } from '@angular/fire/firestore';

export interface Article {
	id: string;
	title: string;
	thumbnailImage: DocumentReference;
	thumbnailImageUrl: string;

}
