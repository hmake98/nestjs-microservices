import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FilesDocument = Files & Document;

@Schema()
export class Files {
  @Prop({ type: 'String' })
  name: string;

  @Prop({ type: 'String' })
  link: string;

  @Prop({ type: 'Number' })
  user: number;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const FilesSchema = SchemaFactory.createForClass(Files);
