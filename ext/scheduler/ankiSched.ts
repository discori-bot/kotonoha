/**
 * Implementation of https://gist.github.com/riceissa/1ead1b9881ffbb48793565ce69d7dbdd for Discori
 */

import { type JsonMap } from '@iarna/toml';
import loadConfigs from '../loaders/config';
import * as utils from '../utils';
import SchedulerBase from './base';
import type Scheduler from '../types/scheduler';

type Status = 'learned' | 'learning' | 'relearning';

const config = loadConfigs().schedulerSettings as JsonMap;
const configNewCards = config.newCards as JsonMap;
const configReviews = config.reviews as JsonMap;
const configLapses = config.lapses as JsonMap;

class AnkiScheduler extends SchedulerBase implements Scheduler {
  private status: Status = 'learning';

  private steps_index = 0;

  private ease_factor = configNewCards.startingEase as number;

  private interval = NaN;

  private schedule(response: string) {
    const newSteps = configNewCards.newSteps as number[];
    if (!['again', 'hard', 'good', 'easy'].includes(response))
      throw new Error("Only values among 'again', 'hard', 'good', or 'easy' are allowed");

    if (this.status === 'learning') {
      if (response === 'hard' || response === 'again') {
        this.steps_index = 0;
        return utils.minuteToDays(newSteps[this.steps_index]);
      }
      if (response === 'good') {
        this.steps_index += 1;
        if (this.steps_index < newSteps.length)
          return utils.minuteToDays(newSteps[this.steps_index]);

        // graduated
        this.status = 'learned';
        this.interval = configNewCards.graduatingInterval as number;
        return this.interval;
      }
      if (response === 'easy') {
        this.status = 'learned';
        this.interval = configNewCards.easyInterval as number;
        return this.interval;
      }
    } else if (this.status === 'learned') {
      const maxInterval = configReviews.maxInterval as number;
      const intervalModifier = configReviews.intervalModifier as number;
      if (response === 'again') {
        this.status = 'relearning';
        this.steps_index = 0;
        this.ease_factor = Math.max(130, this.ease_factor - 20);
        this.interval = Math.max(
          configLapses.minInterval as number,
          (this.interval * (configLapses.newInterval as number)) / 100,
        );
        return utils.minuteToDays((configLapses.lapsesSteps as number[])[0]);
      }
      if (response === 'hard') {
        this.ease_factor = Math.max(130, this.ease_factor - 15);
        this.interval = this.interval * 1.2 * (intervalModifier / 100);
        return Math.min(maxInterval, this.interval);
      }
      if (response === 'good') {
        this.interval = this.interval * (this.ease_factor / 100) * (intervalModifier / 100);
        return Math.min(maxInterval, this.interval);
      }
      if (response === 'easy') {
        this.ease_factor += 15;
        this.interval =
          this.interval *
          (this.ease_factor / 100) *
          (intervalModifier / 100) *
          ((configReviews.easyBonus as number) / 100);
        return Math.min(maxInterval, this.interval);
      }
    } else if (this.status === 'relearning') {
      const lapsesSteps = configLapses.lapsesSteps as number[];
      if (response === 'again' || response === 'hard') {
        this.steps_index = 0;
        return utils.minuteToDays(lapsesSteps[0]);
      }
      if (response === 'good' || response === 'easy') {
        this.steps_index += 1;
        if (this.steps_index < lapsesSteps.length)
          return utils.minuteToDays(lapsesSteps[this.steps_index]);
        // re-graduated
        this.status = 'learned';
        return this.interval;
      }
    }
    throw new Error("status is not one of 'learning', 'learned' or 'relearning'");
  }

  public answer(response: string) {
    const days = this.schedule(response);
    this.dueDate = Date.now() + utils.DaysToMillis(days);
    return days;
  }
}

export default AnkiScheduler;
