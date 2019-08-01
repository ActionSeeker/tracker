import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackerModule } from './tracker/tracker.module';
import { ScheduleModule } from 'nest-schedule';

@Module({
  imports: [
    TrackerModule,
    ScheduleModule.register(),
    MongooseModule.forRoot('mongodb://localhost:27017/tracker'),
  ],
  controllers: [AppController],
  providers: [AppService], //, TrackerService ResourceService ],
})
export class AppModule {}
