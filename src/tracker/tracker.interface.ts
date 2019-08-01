import { Document } from 'mongoose';

export interface Tracker extends Document {
  readonly id: string;
  readonly url: string;
  readonly timestamp: Date;
}
