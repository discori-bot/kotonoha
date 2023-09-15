import * as utils from '../utils';

class SchedulerBase {
  public reviewTimestamp = new Date();

  public nextReviewTimestamp = new Date();

  public suspended = false;

  public marked = false;

  public buried = false;

  public lapseCounter = 0;

  public init(
    reviewTimestamp?: Date,
    nextReviewTimestamp?: Date,
    suspended?: boolean,
    buried?: boolean,
    marked?: boolean,
    lapseCounter?: number,
  ) {
    this.reviewTimestamp = reviewTimestamp || new Date();
    this.nextReviewTimestamp = nextReviewTimestamp || new Date();
    this.suspended = suspended || false;
    this.buried = buried || false;
    this.marked = marked || false;
    this.lapseCounter = lapseCounter || 0;
  }

  public toggleBury() {
    const waitTime = utils.daysToMillis(1);
    this.buried = !this.buried;

    if (this.buried) {
      this.nextReviewTimestamp = new Date(
        Math.max(this.nextReviewTimestamp.getTime(), Date.now()) + waitTime,
      );
      setTimeout(() => {
        this.buried = false;
      }, waitTime);
    } else {
      this.nextReviewTimestamp = new Date(this.nextReviewTimestamp.getTime() - waitTime);
    }
  }

  public toggleSuspend() {
    this.suspended = !this.suspended;
  }

  public toggleMark() {
    this.marked = !this.marked;
  }
}

export type RandomGenerator = () => number;
export type Status = 'review' | 'learning' | 'relearning';
export default SchedulerBase;
