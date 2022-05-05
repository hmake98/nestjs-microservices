import { Process, Processor } from '@nestjs/bull';
import { ConfigService } from '../config/config.service';
import { join } from 'path';
import { readFile } from 'fs';
import { SES } from 'aws-sdk';
import { Logger } from '@nestjs/common';
import * as _ from 'lodash';

enum EmailTemplates {
  FORGOT_PASSWORD = 'forgot-password',
  POST_UPDATED = 'post-updated',
}

@Processor('email-sender')
export class TaskProcessor {
  emailService: SES;
  logger: Logger;
  constructor(private configService: ConfigService) {
    this.logger = new Logger();
    this.emailService = new SES({
      ...this.configService.get('aws'),
    });
  }

  @Process()
  async senderHanlder(job) {
    try {
      // eslint-disable-next-line prefer-const
      let { template, payload } = job.data;
      template = EmailTemplates[template];
      const templatePath = join(__dirname, '../templates/', `${template}.html`);
      _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
      let _content = await this.readFilePromise(templatePath);
      const compiled = _.template(_content);
      _content = compiled(payload.data);
      this.emailService
        .sendEmail({
          Source: this.configService.get('sourceEmail'),
          Destination: {
            ToAddresses: payload.emails,
          },
          Message: {
            Body: {
              Html: {
                Charset: 'UTF-8',
                Data: _content,
              },
            },
            Subject: {
              Charset: 'UTF-8',
              Data: payload.subject,
            },
          },
        })
        .promise()
        .catch((error) => this.logger.error(error));
    } catch (e) {
      this.logger.error(e);
    }
  }

  readFilePromise(filePath): Promise<string> {
    return new Promise((resolve, reject) => {
      readFile(filePath, 'utf8', (err, html) => {
        if (!err) {
          resolve(html);
        } else {
          reject(err);
        }
      });
    });
  }
}
