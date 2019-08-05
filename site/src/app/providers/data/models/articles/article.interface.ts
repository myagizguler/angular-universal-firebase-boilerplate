import { FLDocument } from '../flamelink/fl-document.interface';
import { Hashtag } from '../hashtags/hashtag.interface';

export interface Article extends FLDocument {
	title: string;
	hashtags: Hashtag[]; // Populated
}
