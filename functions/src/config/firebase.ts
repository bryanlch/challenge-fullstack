import * as admin from 'firebase-admin';

if (!admin.apps.length) {
   admin.initializeApp({
      projectId: 'challenge-to-do'
   });
}

export const db = admin.firestore();

db.settings({
   ignoreUndefinedProperties: true
});