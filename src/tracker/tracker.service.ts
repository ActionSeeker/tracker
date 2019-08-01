import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tracker } from './tracker.interface';
import { NestSchedule, Cron } from 'nest-schedule';
import * as puppeteer from 'puppeteer';

@Injectable()
export class TrackerService extends NestSchedule {
  constructor(
    @InjectModel('Tracker') private readonly trackerModel: Model<Tracker>,
  ) {
    super();
  }

  @Cron('* * * * *')
  async visitWebPage() {
    console.log('Here');
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();
    await page.goto('http://www.google.com');
    await page.screenshot({ path: `screen-shot-${+new Date()}.jpg` });
    await browser.close();
  }
}
