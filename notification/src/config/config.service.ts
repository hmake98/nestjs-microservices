import { config } from 'dotenv';
config();
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private config: { [key: string]: any } = {};
  constructor() {
    this.config.rb_url = process.env.RABBITMQ_URL;
    this.config.servicePort = process.env.NOTIFICATION_PORT;
    this.config.database_uri = process.env.NOTIFICATION_MONGO_URI;
    this.config.notification_queue = process.env.RABBITMQ_NOTIFICATION_QUEUE;
    this.config.token_queue = process.env.RABBITMQ_TOKEN_QUEUE;
    this.config.env = process.env.NODE_ENV;
  }

  public get(key: string): any {
    return this.config[key];
  }
}
