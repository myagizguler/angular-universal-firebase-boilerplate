import { initializeApp } from 'firebase-admin';
initializeApp();

import universal from './universal/server-function';

export const ssr = universal;