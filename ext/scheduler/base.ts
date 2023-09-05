import * as utils from '../utils';

class SchedulerBase {
  public dueDate: number;

  public suspended: boolean;

  public marked: boolean;

  public buried: boolean;

  constructor() {
    this.dueDate = Date.now();
    this.suspended = false;
    this.buried = false;
    this.marked = false;
  }

  public toggleBury() {
    const waitTime = utils.DaysToMillis(1);
    this.buried = !this.buried;

    if (this.buried) {
      this.dueDate += waitTime;
      setTimeout(() => {
        this.buried = false;
      }, waitTime);
    } else {
      this.dueDate -= waitTime;
    }
  }

  public toggleSuspend() {
    this.suspended = !this.suspended;
  }

  public toggleMark() {
    this.marked = !this.marked;
  }
}

export default SchedulerBase;
