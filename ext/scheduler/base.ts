import * as utils from '../utils';

class SchedulerBase {
  public dueDate = Date.now();

  public suspended = false;

  public marked = false;

  public buried = false;

  public init(dueDate?: number, suspended?: boolean, buried?: boolean, marked?: boolean) {
    this.dueDate = dueDate || Date.now();
    this.suspended = suspended || false;
    this.buried = buried || false;
    this.marked = marked || false;
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
