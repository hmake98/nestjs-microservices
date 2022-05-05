import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import * as path from 'path';

@Processor('email-sender')
export class TaskProcessor {
  logger: Logger;
  constructor() {
    firebase.initializeApp({
      credential: firebase.credential.cert(
        path.join(__dirname, '../../firebase.config.json'),
      ),
    });
  }

  @Process()
  handleNotification(data) {
    const { token, content, payload } = data;
    this.sendMessage(token, content, payload)
      .then(() => {
        this.logger.log('Notificaiton sent successfully');
      })
      .catch((e) => {
        this.logger.error('Notification failed', e);
      });
  }

  public sendMessage(
    token: string,
    message?: string,
    payload?: any,
  ): Promise<string> {
    return firebase.messaging().send({
      token,
      notification: {
        body: message,
      },
      data: payload,
    });
  }

  public async multiCastMessage(
    tokens: [],
    message?: string,
    payload?: any,
  ): Promise<firebase.messaging.BatchResponse> {
    return firebase.messaging().sendMulticast({
      tokens,
      notification: {
        body: message,
      },
      data: payload,
    });
  }
}
