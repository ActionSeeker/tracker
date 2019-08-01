import * as mongoose from 'mongoose';
import { v4 } from 'uuid';

export const TrackerSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: v4,
    },
    url: String,
  },
  {
    timestamps: {
      createdAt: 'time',
    },
  },
);
