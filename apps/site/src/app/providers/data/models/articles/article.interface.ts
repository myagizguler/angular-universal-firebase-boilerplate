import { FLDocument } from '../flamelink/fl-document.interface';

export interface Article extends FLDocument {
	title: string;
	content: string; // Markdown
}
