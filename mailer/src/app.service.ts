import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
@Injectable()
export class AppService {
  constructor(@InjectQueue('email-sender') private taskQueue: Queue) {}
  public async sendEmail(data): Promise<void> {
    this.taskQueue.add(data, { backoff: 3 });
  }
}
