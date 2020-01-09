import { FLDocument } from '../flamelink/fl-document';

export interface Idea extends FLDocument {
	author: string;
	content: string;
}
