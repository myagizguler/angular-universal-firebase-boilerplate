import * as admin from 'firebase-admin';
import * as fireFunctions from 'firebase-functions';

export const firebaseApp = admin.initializeApp();

export const firestore = firebaseApp.firestore();
export const functions = fireFunctions;


