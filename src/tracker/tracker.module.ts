import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackerSchema } from './tracker.schema';
import { TrackerService } from './tracker.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Tracker', schema: TrackerSchema }])],
    providers: [TrackerService]
})
export class TrackerModule { }
