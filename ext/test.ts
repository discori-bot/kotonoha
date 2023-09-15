import AnkiScheduler from './scheduler/anki';

import FSRSScheduler from './scheduler/fsrs';

import * as utils from './utils';

import type { Params } from './scheduler/fsrs';

const stubRandomGenerator = () => 0.6555033249452011;
const stubDisableAnkiFuzz = () => 0;

const deckParams: Map<string, Params> = new Map();
deckParams.set('default config', {
  w: [
    0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05, 0.34, 1.26, 0.29,
    2.61,
  ],
  requestRetention: 0.9,
  maximumInterval: 36500,
});

/* Configuration End */

describe('Anki Scheduler', () => {
  describe('with fuzz disabled', () => {
    it("gives the correct intervals after rating 'good' continuously, with first rating 'again'", () => {
      const testData = ['again', ...Array<string>(9).fill('good')];
      const expectedIntervals = [
        '1 minutes',
        '10 minutes',
        '1 days',
        '2.5 days',
        '6.25 days',
        '15.63 days',
        '1.28 months',
        '3.21 months',
        '8.02 months',
        '1.67 years',
      ];
      const card = new AnkiScheduler();
      const intervals: string[] = [];
      for (const r of testData) {
        const t = card.answer(r, stubDisableAnkiFuzz);
        intervals.push(utils.humanFriendlyTime(t));
      }
      expect(intervals).toEqual(expectedIntervals);
    });
    it("gives the correct intervals after rating 'good' continuously, with first rating 'hard'", () => {
      const testData = ['hard', ...Array<string>(9).fill('good')];
      const expectedIntervals = [
        '1 minutes',
        '10 minutes',
        '1 days',
        '2.5 days',
        '6.25 days',
        '15.63 days',
        '1.28 months',
        '3.21 months',
        '8.02 months',
        '1.67 years',
      ];
      const card = new AnkiScheduler();
      const intervals: string[] = [];
      for (const r of testData) {
        const t = card.answer(r, stubDisableAnkiFuzz);
        intervals.push(utils.humanFriendlyTime(t));
      }
      expect(intervals).toEqual(expectedIntervals);
    });
    it("gives the correct intervals after rating 'good' continuously, with first rating 'good'", () => {
      const testData = ['good', ...Array<string>(9).fill('good')];
      const expectedIntervals = [
        '10 minutes',
        '1 days',
        '2.5 days',
        '6.25 days',
        '15.63 days',
        '1.28 months',
        '3.21 months',
        '8.02 months',
        '1.67 years',
        '4.18 years',
      ];
      const card = new AnkiScheduler();
      const intervals: string[] = [];
      for (const r of testData) {
        const t = card.answer(r, stubDisableAnkiFuzz);
        intervals.push(utils.humanFriendlyTime(t));
      }
      expect(intervals).toEqual(expectedIntervals);
    });
    it("gives the correct intervals after rating 'good' continuously, with first rating 'easy'", () => {
      const testData = ['easy', ...Array<string>(9).fill('good')];
      const expectedIntervals = [
        '4 days',
        '10 days',
        '25 days',
        '2.05 months',
        '5.13 months',
        '1.07 years',
        '2.67 years',
        '6.68 years',
        '16.71 years',
        '41.78 years',
      ];
      const card = new AnkiScheduler();
      const intervals: string[] = [];
      for (const r of testData) {
        const t = card.answer(r, stubDisableAnkiFuzz);
        intervals.push(utils.humanFriendlyTime(t));
      }
      expect(intervals).toEqual(expectedIntervals);
    });
    it('gives the correct intervals when rating in a random sequence', () => {
      const testData = [
        'good',
        'hard',
        'easy',
        'easy',
        'hard',
        'again',
        'again',
        'hard',
        'easy',
        'good',
        'easy',
        'again',
        'hard',
      ];
      const expectedIntervals = [
        '10 minutes',
        '1 minutes',
        '4 days',
        '13.78 days',
        '16.54 days',
        '10 minutes',
        '10 minutes',
        '10 minutes',
        '11.58 days',
        '26.62 days',
        '2.79 months',
        '10 minutes',
        '10 minutes',
      ];
      const card = new AnkiScheduler();
      const intervals: string[] = [];
      for (const r of testData) {
        const t = card.answer(r, stubDisableAnkiFuzz);
        intervals.push(utils.humanFriendlyTime(t));
      }
      expect(intervals).toEqual(expectedIntervals);
    });
  });
  test('works with fuzz', () => {
    const testData = ['good', ...Array<string>(9).fill('good')];
    const expectedIntervals = [
      '11.31 minutes',
      '1.12 days',
      '2.78 days',
      '6.83 days',
      '16.74 days',
      '1.35 months',
      '3.34 months',
      '8.31 months',
      '1.73 years',
      '4.32 years',
    ];
    const card = new AnkiScheduler();
    const intervals: string[] = [];
    for (const r of testData) {
      const t = card.answer(r, stubRandomGenerator);
      intervals.push(utils.humanFriendlyTime(t));
    }
    expect(intervals).toEqual(expectedIntervals);
  });
});
describe('FSRS Scheduler', () => {
  describe('with fuzz disabled', () => {
    it("gives the correct intervals after rating 'good' continuously, with first rating 'again'", () => {
      const testData = ['again', ...Array<string>(9).fill('good')];
      const expectedIntervals = [
        '1 minutes',
        '10 minutes',
        '1 days',
        '2 days',
        '6 days',
        '14 days',
        '1.05 months',
        '2.27 months',
        '4.63 months',
        '9.03 months',
      ];
      const card = new FSRSScheduler(deckParams);
      card.enableFuzz = false;
      const intervals: string[] = [];
      for (const r of testData) {
        const t = card.answer(r);
        intervals.push(utils.humanFriendlyTime(t));
      }
      expect(intervals).toEqual(expectedIntervals);
    });
    it("gives the correct intervals after rating 'good' continuously, with first rating 'hard'", () => {
      const testData = ['hard', ...Array<string>(9).fill('good')];
      const expectedIntervals = [
        '1 minutes',
        '10 minutes',
        '1 days',
        '3 days',
        '9 days',
        '24 days',
        '1.94 months',
        '4.4 months',
        '9.43 months',
        '1.6 years',
      ];
      const card = new FSRSScheduler(deckParams);
      card.enableFuzz = false;
      const intervals: string[] = [];
      for (const r of testData) {
        const t = card.answer(r);
        intervals.push(utils.humanFriendlyTime(t));
      }
      expect(intervals).toEqual(expectedIntervals);
    });
    it("gives the correct intervals after rating 'good' continuously, with first rating 'good'", () => {
      const testData = ['good', ...Array<string>(9).fill('good')];
      const expectedIntervals = [
        '10 minutes',
        '2 days',
        '7 days',
        '21 days',
        '1.91 months',
        '4.76 months',
        '11.07 months',
        '2.01 years',
        '4.12 years',
        '8.05 years',
      ];
      const card = new FSRSScheduler(deckParams);
      card.enableFuzz = false;
      const intervals: string[] = [];
      for (const r of testData) {
        const t = card.answer(r);
        intervals.push(utils.humanFriendlyTime(t));
      }
      expect(intervals).toEqual(expectedIntervals);
    });
    it("gives the correct intervals after rating 'good' continuously, with first rating 'easy'", () => {
      const testData = ['easy', ...Array<string>(9).fill('good')];
      const expectedIntervals = [
        '6 days',
        '20 days',
        '1.97 months',
        '5.39 months',
        '1.12 years',
        '2.58 years',
        '5.59 years',
        '11.43 years',
        '22.22 years',
        '41.29 years',
      ];
      const card = new FSRSScheduler(deckParams);
      card.enableFuzz = false;
      const intervals: string[] = [];
      for (const r of testData) {
        const t = card.answer(r);
        intervals.push(utils.humanFriendlyTime(t));
      }
      expect(intervals).toEqual(expectedIntervals);
    });
    it('gives the correct intervals when rating in a random sequence', () => {
      const testData = [
        'good',
        'hard',
        'easy',
        'easy',
        'hard',
        'again',
        'again',
        'hard',
        'easy',
        'good',
        'easy',
        'again',
        'hard',
      ];
      const expectedIntervals = [
        '10 minutes',
        '1 minutes',
        '6 days',
        '1.58 months',
        '2.37 months',
        '10 minutes',
        '10 minutes',
        '10 minutes',
        '8 days',
        '21 days',
        '3.84 months',
        '10 minutes',
        '10 minutes',
      ];
      const card = new FSRSScheduler(deckParams);
      card.enableFuzz = false;
      const intervals: string[] = [];
      for (const r of testData) {
        const t = card.answer(r);
        intervals.push(utils.humanFriendlyTime(t));
      }
      expect(intervals).toEqual(expectedIntervals);
    });
  });
  test('works with fuzz', () => {
    const testData = ['good', ...Array<string>(9).fill('good')];
    const expectedIntervals = [
      '10 minutes',
      '2 days',
      '7 days',
      '22 days',
      '1.97 months',
      '4.99 months',
      '11.66 months',
      '2.12 years',
      '4.38 years',
      '8.6 years',
    ];
    const card = new FSRSScheduler(deckParams);
    card.enableFuzz = true;

    const intervals: string[] = [];
    for (const r of testData) {
      const t = card.answer(r, stubRandomGenerator);
      intervals.push(utils.humanFriendlyTime(t));
    }
    expect(intervals).toEqual(expectedIntervals);
  });
});
