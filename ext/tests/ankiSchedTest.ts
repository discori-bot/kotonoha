import assert from 'assert';
import Scheduler from '../ankiSched';

// Test 1
const card1 = new Scheduler();
const sched1 = [];
const responses1 = Array<string>(10).fill('good');
for (const r of responses1) {
  const t = card1.answer(r);
  sched1.push(Scheduler.humanFriendlyTime(t));
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
  const t = card2.answer(r);
  sched2.push(Scheduler.humanFriendlyTime(t));
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
