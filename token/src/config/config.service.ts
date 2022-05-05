import { config } from 'dotenv';
config();
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private config: { [key: string]: any } = {};
  constructor() {
    this.config.accessExp = process.env.ACCESS_EXP;
    this.config.refreshExp = process.env.REFRESH_EXP;
    this.config.secretKey = process.env.APP_SECRET;
    this.config.rb_url = process.env.RABBITMQ_URL;
    this.config.token_queue = process.env.RABBITMQ_TOKEN_QUEUE;
  }

  public get(key: string): any {
    return this.config[key];
  }
}
