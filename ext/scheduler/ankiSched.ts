/**
 * Implementation of https://gist.github.com/riceissa/1ead1b9881ffbb48793565ce69d7dbdd for Discori.
 */

import { type JsonMap } from '@iarna/toml';
import loadConfigs from '../../src/loaders/config';
import * as utils from '../utils';
import SchedulerBase from './base';
import type { RandomGenerator, Status } from './base';
import type Scheduler from '../types/scheduler';

type ActivationFunction = (input: number) => number;
type SchedulingInformation = {
  buried: boolean;
  dueDate: number;
  easeFactor: number;
  interval: number;
  marked: boolean;
  reviewTimestamp: number;
  status: Status;
  stepsIndex: number;
  suspended: boolean;
};
type Rating = 'again' | 'hard' | 'good' | 'easy';

const config = loadConfigs().schedulerSettings as JsonMap;
const configNewCards = config.newCards as JsonMap;
const configReviews = config.reviews as JsonMap;
const configLapses = config.lapses as JsonMap;

const calculateIntervalWithFuzz = (
  interval: number,
  activationFunction: ActivationFunction,
  randomGenerator: RandomGenerator,
) => interval + interval * activationFunction(interval) * randomGenerator();

const deleteFromHistory = (history: SchedulingInformation[]) => history.pop();
const shiftHistory = (history: SchedulingInformation[]) => history.shift();
/**
 * Anki-based scheduler algorithm.
 */
class AnkiScheduler extends SchedulerBase implements Scheduler {
  private status: Status = 'learning';

  private steps_index = 0;

  private ease_factor = configNewCards.startingEase as number;

  private interval = NaN;

  private reviewTimestamp = NaN;

  private sessionHistory: SchedulingInformation[] = [];

  private sessionUndoHistory: SchedulingInformation[] = [];

  reps = 0;

  /**
   * Initialize the scheduler in a blank state.
   */
  public init(): void;
  /**
   * Initialize the scheduler from a previous state.
   */
  public init(
    dueDate: number,
    suspended: boolean,
    buried: boolean,
    marked: boolean,
    status: Status,
    stepsIndex: number,
    easeFactor: number,
    interval: number,
    reviewTimestamp: number,
  ): void;
  init(
    dueDate?: number,
    suspended?: boolean,
    buried?: boolean,
    marked?: boolean,
    status?: Status,
    stepsIndex?: number,
    easeFactor?: number,
    interval?: number,
    reviewTimestamp?: number,
  ) {
    super.init(dueDate, suspended, buried, marked);
    this.status = status || 'learning';
    this.steps_index = stepsIndex || 0;
    this.ease_factor = easeFactor || (configNewCards.startingEase as number);
    this.interval = interval || NaN;
    this.reviewTimestamp = reviewTimestamp || NaN;
  }

  public exportSchedulingInformation(): SchedulingInformation {
    return {
      buried: this.buried,
      dueDate: this.dueDate,
      easeFactor: this.ease_factor,
      interval: this.interval,
      marked: this.marked,
      status: this.status,
      stepsIndex: this.steps_index,
      suspended: this.suspended,
      reviewTimestamp: this.reviewTimestamp,
    };
  }

  // Save current state of the scheduler to the history provided.
  private saveCurrentToHistory(history: SchedulingInformation[]) {
    return history.push(this.exportSchedulingInformation());
  }

  private schedule(response: Rating): number {
    const newSteps = configNewCards.newSteps as number[];

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
        this.status = 'review';
        this.interval = configNewCards.graduatingInterval as number;
        return this.interval;
      }
      if (response === 'easy') {
        this.status = 'review';
        this.interval = configNewCards.easyInterval as number;
        return this.interval;
      }
    } else if (this.status === 'review') {
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
        this.status = 'review';
        return this.interval;
      }
    }
    throw new Error("status is not one of 'learning', 'review' or 'relearning'");
  }

  private saveState() {
    // Save the state before answering to the history. The maximum history size is kept at 20.
    if (this.saveCurrentToHistory(this.sessionHistory) > 20) {
      shiftHistory(this.sessionHistory);
    }
    // Reinitialize sessionUndoHistory to an empty array.
    this.sessionUndoHistory = [];
  }

  public answer(response: string): number;
  public answer(response: string, randomGenerator: RandomGenerator): number;
  public answer(response: string, randomGenerator?: RandomGenerator) {
    if (response !== 'again' && response !== 'hard' && response !== 'good' && response !== 'easy')
      throw new Error("Only values among 'again', 'hard', 'good', or 'easy' are allowed");
    this.saveState();

    const fuzzApplied = config.calculateWithFuzz as boolean;
    const activationFunction: ActivationFunction = (input: number) =>
      0.15 / (input / 10 + 1) + 0.05;
    const generator = randomGenerator || (() => Math.random() * 2 - 1);

    const interval = fuzzApplied
      ? calculateIntervalWithFuzz(this.schedule(response), activationFunction, generator)
      : this.schedule(response);

    this.reviewTimestamp = Date.now();
    this.dueDate = this.reviewTimestamp + utils.DaysToMillis(interval);
    this.reps += 1;
    return interval;
  }

  public undo() {
    if (this.sessionHistory.length === 0) return;

    this.saveCurrentToHistory(this.sessionUndoHistory);
    const info = deleteFromHistory(this.sessionHistory);
    if (info === undefined) return;

    const {
      dueDate,
      suspended,
      buried,
      marked,
      status,
      stepsIndex,
      easeFactor,
      interval,
      reviewTimestamp,
    } = info;
    this.init(
      dueDate,
      suspended,
      buried,
      marked,
      status,
      stepsIndex,
      easeFactor,
      interval,
      reviewTimestamp,
    );
  }

  public redo() {
    if (this.sessionUndoHistory.length === 0) return;

    this.saveCurrentToHistory(this.sessionHistory);
    const info = deleteFromHistory(this.sessionUndoHistory);
    if (info === undefined) return;

    const {
      dueDate,
      suspended,
      buried,
      marked,
      status,
      stepsIndex,
      easeFactor,
      interval,
      reviewTimestamp,
    } = info;
    this.init(
      dueDate,
      suspended,
      buried,
      marked,
      status,
      stepsIndex,
      easeFactor,
      interval,
      reviewTimestamp,
    );
  }

  public forget() {
    this.saveState();
    this.init();
  }
}

export default AnkiScheduler;
