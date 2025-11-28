import { Injectable, inject } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MessagingService {
   private messaging = inject(Messaging);
   private firestore = inject(Firestore);
   private auth = inject(AuthService);

   async requestPermission() {
      try {
         const permission = await Notification.requestPermission();
         if (permission === 'granted') {

            const token = await getToken(this.messaging, {
               vapidKey: 'TU_VAPID_KEY_DE_FIREBASE_CONSOLE'
            });

            this.auth.user$.subscribe(user => {
               if (user && token) {
                  this.saveTokenToFirestore(user.uid, token);
               }
            });
         }
      } catch (error) {
         console.error('No se pudo obtener permiso', error);
      }
   }

   listen() {
      onMessage(this.messaging, (payload) => {
         console.log('Mensaje recibido:', payload);
         // Aquí puedes mostrar un MatSnackBar o refrescar la lista de tareas automáticamente
         // taskList.loadTasks(); 
      });
   }

   private async saveTokenToFirestore(userId: string, token: string) {
      const tokenRef = doc(this.firestore, `users/${userId}/fcmTokens/${token}`);
      await setDoc(tokenRef, { lastUpdate: new Date() });
   }
}