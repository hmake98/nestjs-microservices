import { config } from 'dotenv';
config();
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private config: { [key: string]: any } = {};
  constructor() {
    this.config.servicePort = process.env.USER_PORT;
    this.config.service = process.env.USER_HOST;
    this.config.rb_url = process.env.RABBITMQ_URL;
    this.config.token_queue = process.env.RABBITMQ_TOKEN_QUEUE;
    this.config.user_queue = process.env.RABBITMQ_USER_QUEUE;
    this.config.mailer_queue = process.env.RABBITMQ_MAILER_QUEUE;
    this.config.logger_queue = process.env.RABBITMQ_LOGGER_QUEUE;
    this.config.env = process.env.NODE_ENV;
    this.config.database = {
      DB_TYPE: process.env.USER_DB_TYPE,
      DB_HOST: process.env.USER_DB_HOST,
      DB_PORT: process.env.USER_DB_PORT,
      DB_USER: process.env.USER_DB_USER,
      DB_PASSWORD: process.env.USER_DB_PASSWORD,
      DB_NAME: process.env.USER_DB_NAME,
    };
    this.config.google = {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    };
  }

  public get(key: string): any {
    return this.config[key];
  }
}
