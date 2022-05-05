import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Files, FilesDocument } from './database/schema/files.schema';
import { S3 } from 'aws-sdk';
import { ConfigService } from './config/config.service';
import { GetPresignUrlDto } from './core/interfaces/GetPresignUrlDto';

@Injectable()
export class AppService {
  fileService: S3;
  logger: Logger;
  constructor(
    @InjectModel(Files.name) private filesModel: Model<FilesDocument>,
    private configService: ConfigService,
  ) {
    this.fileService = new S3({
      ...this.configService.get('aws'),
    });
  }

  async getPresgin(
    params: GetPresignUrlDto,
    authUserId: number,
  ): Promise<{ url: string }> {
    try {
      const url = await this.fileService.getSignedUrlPromise('putObject', {
        Bucket: this.configService.get('bucket'),
        Key: `${params.type}/${params.fileName}`,
        Expires: Number(this.configService.get('presignExpire')),
      });
      await this.filesModel.create({
        name: params.fileName,
        link: `${params.type}/${params.fileName}`,
        createdAt: new Date(),
        user: authUserId,
      });
      return {
        url,
      };
    } catch (e) {
      this.logger.error(e);
    }
  }
}
