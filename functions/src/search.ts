import { flConfig, flSearchFireFunction } from 'flamelink-text-search';
import { firebase } from './firebase';

flConfig(firebase);
export const search = flSearchFireFunction;

