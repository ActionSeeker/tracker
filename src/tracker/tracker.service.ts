import { writeFileSync } from 'fs';
import { join, sep } from 'path';

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

  getPath(fileName) {
    return join(__dirname, sep, '..', sep, '..', sep, fileName);
  }

  @Cron('* * * * *')
  async visitWebPage() {
    let browser;
    try {
      console.log('Here');
      browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
      });
      let page = await browser.newPage();

      // Broswer specific
      const client = await page.target().createCDPSession();
      await client.send('Performance.enable');

      await page.goto('http://www.google.com');

      await page.screenshot({
        path: this.getPath(`screenshots/screen-shot-${+new Date()}.jpg`),
      });

      let firstMeaningfulPaint = 0;
      let timeElapsedSinceNavigation = 0;
      while (firstMeaningfulPaint === 0) {
        // Introduce this delay -- this delay needs to be considered
        await page.waitFor(200);
        const performanceMetrics = await client.send('Performance.getMetrics');
        firstMeaningfulPaint = this.getAttributeFromMetrics(
          performanceMetrics,
          'FirstMeaningfulPaint',
        );
        let navStarted = this.getAttributeFromMetrics(
          performanceMetrics,
          'NavigationStart',
        );
        timeElapsedSinceNavigation = Math.abs(
          navStarted - firstMeaningfulPaint,
        );
      }

      // Browser agnostic
      const perfTimes: any = await this.getBrowserAgnosticDetails(page);

      perfTimes['FirstMeaningfulPaint'] = timeElapsedSinceNavigation / 1000;

      await browser.close();

      writeFileSync(
        this.getPath(`metrics/${+new Date()}.json`),
        JSON.stringify(perfTimes),
      );
    } catch (error) {
      console.log(error);
      if (browser) await browser.close();
    }
  }

  private async getBrowserAgnosticDetails(page: any) {
    let performance: object = JSON.parse(
      await page.evaluate(() => JSON.stringify(window.performance)),
    );
    const perfTimes: object = this.getRelativePerfTimes(performance);
    return perfTimes;
  }

  private getRelativePerfTimes(performance): object {
    const { timing } = performance;
    const { navigationStart } = timing;
    const relativeTimings: object = Object({});
    for (let param in timing) {
      let difference = timing[param] - navigationStart;
      if (difference >= 0) relativeTimings[param] = difference;
    }
    return relativeTimings;
  }

  private getAttributeFromMetrics(metrics, name): any {
    // console.log(metrics);
    return metrics.metrics.find(x => x.name === name).value * 1000;
    // return page.on('metrics', ({ metrics }) => {
    //   //  metrics.metrics.find(x => x.name === name).value * 1000;
    //   if (metricName === metrics) return Promise.resolve(true);
    // });
  }
}
