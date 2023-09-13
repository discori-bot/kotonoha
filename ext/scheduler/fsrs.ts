/**
 * Implementation of the FSRS scheduling algorithm for Discori.
 *
 * Ye, J., Su, J., & Cao, Y. (2022). A Stochastic Shortest Path Algorithm for Optimizing Spaced Repetition Scheduling [Conference paper]. https://doi.org/10.1145/3534678.3539081
 */

import loadConfigs from '../../src/loaders/config';
import * as utils from '../utils';
import SchedulerBase from './base';
import type { RandomGenerator, Status } from './base';
import type Scheduler from '../types/scheduler';
import type { JsonMap } from '@iarna/toml';

export type Params = {
  maximumInterval: number;
  requestRetention: number;
  w: Weights;
};

type MemState = {
  d: number; // Difficulty
  s: number; // Stability
};

type Rating = 'again' | 'hard' | 'good' | 'easy';

type Weights = number[];

const config = loadConfigs().schedulerSettings as JsonMap;
const configNewCards = config.newCards as JsonMap;
const configLapses = config.lapses as JsonMap;

const constrainDifficulty = (difficulty: number) =>
  Math.min(Math.max(+difficulty.toFixed(2), 1), 10);

class FSRSScheduler extends SchedulerBase implements Scheduler {
  deckParams: Map<string, Params>;

  skipDecks: string[] = [];

  // "Fuzz" is a small random delay to disassociate cards that often appear together.
  enableFuzz = false;

  private params: Params;

  private learningState: MemState;

  private ratings = {
    again: 1,
    hard: 2,
    good: 3,
    easy: 4,
  };

  private interval = NaN;

  private status: Status = 'learning';

  private steps_index = 0;

  private reviewTimestamp = NaN;

  reps = 0;

  constructor(deckParams: Map<string, Params>, deckName?: string) {
    super();
    this.deckParams = deckParams;

    let params;

    if (deckName) {
      params = this.deckParams.get(deckName);
    }

    // If could not find parameters for deckName, initialize to default parameters.
    if (!params) {
      params = this.deckParams.get('default config');
      if (params === undefined) throw new Error('A default config is not present in deckParams.');
    }

    this.params = params;

    this.learningState = {
      d: 0,
      s: 0,
    };
  }

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
    interval: number,
    reviewTimestamp: number,
    learningState: MemState,
  ): void;
  init(
    dueDate?: number,
    suspended?: boolean,
    buried?: boolean,
    marked?: boolean,
    status?: Status,
    stepsIndex?: number,
    interval?: number,
    reviewTimestamp?: number,
    learningState?: MemState,
  ) {
    super.init(dueDate, suspended, buried, marked);
    this.status = status || 'learning';
    this.steps_index = stepsIndex || 0;
    this.interval = interval || NaN;
    this.learningState = learningState || {
      s: 0,
      d: 0,
    };
    this.reviewTimestamp = reviewTimestamp || NaN;
  }

  public fromAnkiScheduler(
    _dueDate: number,
    _suspended: boolean,
    _buried: boolean,
    _marked: boolean,
    _status: Status,
    _stepsIndex: number,
    easeFactor: number,
    interval: number,
  ) {
    this.convertStates(easeFactor, interval);
  }

  private applyFuzz(interval: number, randomGenerator: RandomGenerator) {
    let ivl = interval;
    if (!this.enableFuzz || ivl < 2.5) return ivl;
    ivl = Math.round(ivl);
    let minIvl = Math.max(2, Math.round(ivl * 0.95 - 1));
    const maxIvl = Math.round(ivl * 1.05 + 1);
    const fuzzFactor = randomGenerator();

    if (this.status === 'review') {
      if (ivl > this.interval) {
        minIvl = Math.max(minIvl, this.interval + 1);
      }
    }
    return Math.floor(fuzzFactor * (maxIvl - minIvl + 1) + minIvl);
  }

  private nextInterval(stability: number, randomGenerator: RandomGenerator) {
    const newInterval = this.applyFuzz(stability * this.getIntervalModifier(), randomGenerator);
    return Math.min(Math.max(Math.round(newInterval), 1), this.params.maximumInterval);
  }

  private nextDifficulty(d: number, rating: Rating) {
    const nextD = d - this.params.w[6] * (this.ratings[rating] - 3);
    return constrainDifficulty(this.meanReversion(this.params.w[4], nextD));
  }

  private meanReversion(init: number, current: number) {
    return this.params.w[7] * init + (1 - this.params.w[7]) * current;
  }

  private nextRecallStability(d: number, s: number, r: number, rating: Rating) {
    const hardPenalty: number = rating === 'hard' ? this.params.w[15] : 1;
    const easyBonus: number = rating === 'easy' ? this.params.w[16] : 1;
    return +(
      s *
      (1 +
        Math.exp(this.params.w[8]) *
          (11 - d) *
          s ** -this.params.w[9] *
          (Math.exp((1 - r) * this.params.w[10]) - 1) *
          hardPenalty *
          easyBonus)
    ).toFixed(2);
  }

  private nextForgetStability(d: number, s: number, r: number) {
    return +Math.min(
      this.params.w[11] *
        d ** -this.params.w[12] *
        ((s + 1) ** this.params.w[13] - 1) *
        Math.exp((1 - r) * this.params.w[14]),
      s,
    ).toFixed(2);
  }

  private initDifficulty(rating: Rating) {
    return +constrainDifficulty(
      this.params.w[4] - this.params.w[5] * (this.ratings[rating] - 3),
    ).toFixed(2);
  }

  private initStability(rating: Rating) {
    return +Math.max(this.params.w[this.ratings[rating] - 1], 0.1).toFixed(2);
  }

  // Convert anki-based scheduler state into FSRS scheduler state.
  private convertStates(easeFactor: number, interval: number) {
    const oldS = +Math.max(interval, 0.1).toFixed(2);
    const oldD = constrainDifficulty(
      11 -
        (easeFactor - 1) /
          (Math.exp(this.params.w[8]) *
            oldS ** -this.params.w[9] *
            (Math.exp(0.1 * this.params.w[10]) - 1)),
    );

    this.learningState.d = oldD;
    this.learningState.s = oldS;
  }

  private getIntervalModifier() {
    return 9 * (1 / this.params.requestRetention - 1);
  }

  private schedule(response: Rating, randomGenerator: RandomGenerator): number {
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
        this.status = 'review';
        this.learningState.d = this.initDifficulty(response);
        this.learningState.s = this.initStability(response);
        this.interval = this.nextInterval(this.learningState.s, randomGenerator);
        return this.interval;
      }
      if (response === 'easy') {
        this.status = 'review';
        this.learningState.d = this.initDifficulty(response);
        this.learningState.s = this.initStability(response);
        this.interval = this.nextInterval(this.learningState.s, randomGenerator);
        return this.interval;
      }
    } else if (this.status === 'review') {
      const currentInterval = Number.isNaN(this.reviewTimestamp)
        ? this.interval
        : Math.max(this.interval, Date.now() - this.reviewTimestamp);

      const currentD = this.learningState.d;
      const currentS = this.learningState.s;
      const retrievability = (1 + currentInterval / (9 * currentS)) ** -1;

      // Next learning state
      if (response === 'again') {
        this.learningState.d = this.nextDifficulty(currentD, response);
        this.learningState.s = this.nextForgetStability(
          this.learningState.d,
          currentS,
          retrievability,
        );
      } else {
        this.learningState.d = this.nextDifficulty(currentD, response);
        this.learningState.s = this.nextRecallStability(
          this.learningState.d,
          currentS,
          retrievability,
          response,
        );
      }

      const interval = this.nextInterval(this.learningState.s, randomGenerator);
      this.interval = interval;

      if (response === 'again') {
        this.status = 'relearning';
        this.steps_index = 0;
        return utils.minuteToDays((configLapses.lapsesSteps as number[])[0]);
      }
      return this.interval;
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
        this.interval = this.nextInterval(this.learningState.s, randomGenerator);
        return this.interval;
      }
    }
    throw new Error("status is not one of 'learning', 'review' or 'relearning'");
  }

  public answer(response: string): number;
  public answer(response: string, randomGenerator: RandomGenerator): number;
  public answer(response: string, randomGenerator?: RandomGenerator) {
    if (response !== 'again' && response !== 'hard' && response !== 'good' && response !== 'easy')
      throw new Error("Only values among 'again', 'hard', 'good', or 'easy' are allowed");
    const interval = this.schedule(response, randomGenerator || Math.random);
    this.reviewTimestamp = Date.now();

    this.dueDate = this.reviewTimestamp + utils.DaysToMillis(interval);
    return interval;
  }

  public redo() {
    //
  }

  public undo() {
    //
  }
}

export default FSRSScheduler;
