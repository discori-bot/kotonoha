/**
 * Implementation of https://gist.github.com/riceissa/1ead1b9881ffbb48793565ce69d7dbdd for Discori
 */

import { type JsonMap } from '@iarna/toml';
import loadConfigs from '../src/loaders/config';

type Status = 'learned' | 'learning' | 'relearning';

const config = loadConfigs().schedulerSettings as JsonMap;
const configNewCards = config.newCards as JsonMap;
const configReviews = config.reviews as JsonMap;
const configLapses = config.lapses as JsonMap;

class Scheduler {
  static minuteToDays = (minutes: number) => minutes / (60 * 24);
  
  static humanFriendlyTime = (days: number) => {
    if (days === null) return days;
    if (days < 1) return `${+(days * 24 * 60).toFixed(2)} minutes`;
    if (days < 30) return `${+days.toFixed(2)} days`;
    if (days < 365) return `${+(days / (365.25 / 12)).toFixed(2)} months`;
    return `${+(days / 365.25).toFixed(2)} years`;
  };

  private status: Status = 'learning';

  private steps_index = 0;

  private ease_factor = configNewCards.startingEase as number;

  private interval = NaN;

  public answer(response: string) {
    const newSteps = configNewCards.newSteps as number[];
    if (!['again', 'hard', 'good', 'easy'].includes(response))
      throw new Error("Only values among 'again', 'hard', 'good', or 'easy' are allowed");

    if (this.status === 'learning') {
      if (response === 'hard' || response === 'again') {
        this.steps_index = 0;
        return Scheduler.minuteToDays(newSteps[this.steps_index]);
      }
      if (response === 'good') {
        this.steps_index += 1;
        if (this.steps_index < newSteps.length) return Scheduler.minuteToDays(newSteps[this.steps_index]);

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
        return Scheduler.minuteToDays((configLapses.lapsesSteps as number[])[0]);
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
        return Scheduler.minuteToDays(lapsesSteps[0]);
      }
      if (response === 'good' || response === 'easy') {
        this.steps_index += 1;
        if (this.steps_index < lapsesSteps.length)
          return Scheduler.minuteToDays(lapsesSteps[this.steps_index]);
        // re-graduated
        this.status = 'learned';
        return this.interval;
      }
    }
    throw new Error("status is not one of 'learning', 'learned' or 'relearning'");
  }
}

export default Scheduler;
