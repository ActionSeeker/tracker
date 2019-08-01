import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tracker } from './tracker.interface';

@Injectable()
export class TrackerService {
  constructor(
    @InjectModel('Tracker') private readonly trackerModel: Model<Tracker>,
  ) {}
}
