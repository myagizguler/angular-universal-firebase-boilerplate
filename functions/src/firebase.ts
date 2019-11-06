import * as admin from 'firebase-admin';
import * as fireFunctions from 'firebase-functions';

export const firebase = admin.initializeApp();
export const firestore = firebase.firestore();
export const functions = fireFunctions;


