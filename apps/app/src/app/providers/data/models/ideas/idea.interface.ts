import { FLDocument } from '../flamelink/fl-document.interface';

export interface Idea extends FLDocument {
	author: string;
	content: string;
}
