import *  as mongoose from 'mongoose'
import uuid from 'uuid/v4';

export const TrackerSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuid.v4
    },
    url: String
},
    {
        timestamps: {
            createdAt: 'time'
        }
    }
);