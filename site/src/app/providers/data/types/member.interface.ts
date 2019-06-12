import { DocumentReference } from '@angular/fire/firestore';

export interface Member {
	id: string;
	name: string;
	title: string;
	introduction: string; // Markdown
	description: string; // Markdown
	image: DocumentReference[];
	imageUrl: string;
	websiteUrl: string;
	chairman: boolean;
}
