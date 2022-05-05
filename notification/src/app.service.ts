import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Notification,
  NotifcationDocument,
} from 'src/database/schema/notification.schema';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { INotificationPayload } from './core/interfaces/INotificationPayload';
@Injectable()
export class AppService {
  constructor(
    @InjectQueue('email-sender') private taskQueue: Queue,
    @InjectModel(Notification.name)
    private notificationModel: Model<NotifcationDocument>,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {
    this.userClient.connect();
  }

  public async manageNotifications(data: INotificationPayload): Promise<void> {
    const { content, type, payload, userId } = data;
    await this.notificationModel.create({
      user: userId,
      content,
      type,
      payload,
    });
    const deviceId = await firstValueFrom(
      this.userClient.send('get_device_id', { userId }),
    );
    this.taskQueue.add({ token: deviceId, ...data }, { backoff: 3 });
  }

  public async getUserNotifications(
    userId: number,
    skip: number,
    limit: number,
  ) {
    return this.notificationModel.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);
  }
}
