import { config } from 'dotenv';
config();
import { Injectable } from '@nestjs/common';
@Injectable()
export class ConfigService {
  private config: { [key: string]: any } = {};
  constructor() {
    this.config.servicePort = process.env.POST_PORT;
    this.config.rb_url = process.env.RABBITMQ_URL;
    this.config.token_queue = process.env.RABBITMQ_TOKEN_QUEUE;
    this.config.user_queue = process.env.RABBITMQ_USER_QUEUE;
    this.config.post_queue = process.env.RABBITMQ_POST_QUEUE;
    this.config.mailer_queue = process.env.RABBITMQ_MAILER_QUEUE;
    this.config.env = process.env.NODE_ENV;
    this.config.database = {
      DB_TYPE: process.env.POST_DB_TYPE,
      DB_HOST: process.env.POST_DB_HOST,
      DB_PORT: process.env.POST_DB_PORT,
      DB_USER: process.env.POST_DB_USER,
      DB_PASSWORD: process.env.POST_DB_PASSWORD,
      DB_NAME: process.env.POST_DB_NAME,
    };
  }

  public get(key: string): any {
    return this.config[key];
  }
}
