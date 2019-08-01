import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackerService } from './tracker/tracker.service';
import { ResourceService } from './resource/resource.service';
import { TrackerModule } from './tracker/tracker.module';
import { ResourceModule } from './resource/resource.module';

@Module({
  imports: [TrackerModule, ResourceModule, MongooseModule.forRoot('mongodb://localhost:27017/tracker')],
  controllers: [AppController],
  providers: [AppService, TrackerService, ResourceService],
})

export class AppModule { }
