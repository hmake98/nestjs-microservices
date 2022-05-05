import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type NotifcationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop({ type: 'String' })
  content: string;

  @Prop({ type: 'String' })
  type: string;

  @Prop({ type: 'Number' })
  user: number;

  @Prop({ type: MongooseSchema.Types.Mixed })
  payload: any;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
