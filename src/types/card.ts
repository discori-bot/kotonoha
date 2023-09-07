import type Scheduler from './scheduler';

interface Card extends Scheduler {
  meanings: object;
  word: string;
}

export default Card;
