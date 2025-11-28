import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
   admin.initializeApp();
}

const db = admin.firestore();
const fcm = admin.messaging();

export const sendTaskNotification = onDocumentCreated('tasks/{taskId}', async (event) => {
   const snapshot = event.data;

   if (!snapshot) {
      logger.error('No data associated with the event');
      return;
   }

   const task = snapshot.data();
   const assignedUserId = task.assignedToId;

   if (!assignedUserId || task.supervisorId === assignedUserId) return;

   try {
      const tokensSnapshot = await db
         .collection('users')
         .doc(assignedUserId)
         .collection('fcmTokens')
         .get();

      if (tokensSnapshot.empty) {
         logger.info('No tokens found for user', assignedUserId);
         return;
      }

      const tokens = tokensSnapshot.docs.map(doc => doc.id);

      const message: admin.messaging.MulticastMessage = {
         tokens: tokens,
         notification: {
            title: 'Nueva Tarea Asignada',
            body: `${task.title} ha sido asignada a ti.`
         },
         data: {
            click_action: '/app/tasks',
            taskId: event.params.taskId
         }
      };

      const response = await fcm.sendEachForMulticast(message);

      if (response.failureCount > 0) {
         const failedTokens: string[] = [];
         response.responses.forEach((resp, idx) => {
            if (!resp.success) {
               failedTokens.push(tokens[idx]);
            }
         });
         logger.warn('Fallo el envío a algunos tokens:', failedTokens);
      }

      logger.info('Notificación enviada a', assignedUserId);

   } catch (error) {
      logger.error('Error enviando notificación', error);
   }
});