import type Scheduler from './scheduler';

interface Card extends Scheduler {
  word: string;
  meanings: object;
}

export default Card;
