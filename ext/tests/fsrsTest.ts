import assert from 'assert';

import FSRSScheduler from '../scheduler/fsrs';

import * as utils from '../utils';

import type { Params } from '../scheduler/fsrs';

const deckParams: Map<string, Params> = new Map();
deckParams.set('default config', {
  // Can be optimized via FSRS4Anki optimizer.
  w: [
    0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05, 0.34, 1.26, 0.29,
    2.61,
  ],
  requestRetention: 0.9, // Recommended: 0.75 ~ 0.95
  maximumInterval: 36500,
});
const card1 = new FSRSScheduler(deckParams);
const sched1 = [];
const responses1 = Array<string>(10).fill('good');
for (const r of responses1) {
  const t = card1.answer(r, Math.random);
  sched1.push(utils.humanFriendlyTime(t));
}
const expected1 = [
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

assert.deepStrictEqual(sched1, expected1);
