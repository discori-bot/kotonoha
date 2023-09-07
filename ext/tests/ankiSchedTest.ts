import assert from 'assert';
import Scheduler from '../scheduler/ankiSched';
import * as utils from '../utils';

const stubRandomGenerator = () => 0.6555033249452011;
const stubDisableFuzz = () => 0;

// Test 1
const card1 = new Scheduler();
const sched1 = [];
const responses1 = Array<string>(10).fill('good');
for (const r of responses1) {
  const t = card1.answer(r, stubDisableFuzz);
  sched1.push(utils.humanFriendlyTime(t));
}
const expected1 = [
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
assert.deepStrictEqual(sched1, expected1);

// Test 2
const card2 = new Scheduler();
const sched2 = [];
const responses2 = ['good', 'good', 'good', 'again', 'good', 'hard', 'good', 'good', 'easy'];
for (const r of responses2) {
  const t = card2.answer(r, stubDisableFuzz);
  sched2.push(utils.humanFriendlyTime(t));
}
const expected2 = [
  '10 minutes',
  '1 days',
  '2.5 days',
  '10 minutes',
  '1.75 days',
  '2.1 days',
  '4.51 days',
  '9.71 days',
  '29.02 days',
];
assert.deepStrictEqual(sched2, expected2);

// Test 3
const card3 = new Scheduler();
const sched3 = [];
const responses3 = Array<string>(10).fill('good');
for (const r of responses3) {
  const t = card3.answer(r, stubRandomGenerator);
  sched3.push(utils.humanFriendlyTime(t));
}
const expected3 = [
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
assert.deepStrictEqual(sched3, expected3);

// Test 4
const card4 = new Scheduler();
const sched4 = [];
const responses4 = ['good', 'good', 'good', 'again', 'good', 'hard', 'good', 'good', 'easy'];
for (const r of responses4) {
  const t = card4.answer(r, stubRandomGenerator);
  sched4.push(utils.humanFriendlyTime(t));
}
const expected4 = [
  '11.31 minutes',
  '1.12 days',
  '2.78 days',
  '11.31 minutes',
  '1.95 days',
  '2.34 days',
  '4.97 days',
  '10.51 days',
  '1.01 months'
];
assert.deepStrictEqual(sched4, expected4);

