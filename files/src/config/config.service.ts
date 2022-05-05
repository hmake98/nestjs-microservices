import { config } from 'dotenv';
config();
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private config: { [key: string]: any } = {};
  constructor() {
    this.config.rb_url = process.env.RABBITMQ_URL;
    this.config.servicePort = process.env.FILES_PORT;
    this.config.database_uri = process.env.FILES_MONGO_URI;
    this.config.presignExpire = process.env.AWS_EXPIRE_LINK;
    this.config.bucket = process.env.AWS_BUCKET;
    this.config.files_queue = process.env.RABBITMQ_FILES_QUEUE;
    this.config.token_queue = process.env.RABBITMQ_TOKEN_QUEUE;
    this.config.env = process.env.NODE_ENV;
    this.config.aws = {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    };
  }

  public get(key: string): any {
    return this.config[key];
  }
}
