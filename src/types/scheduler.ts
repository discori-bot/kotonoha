interface Scheduler {
  /**
   * Returns the timestamp for the due date of this card.
   * @param response - A value among 'again', 'easy', 'hard', 'good' or 1, 2, 3, 4
   */
  answer(response: string): number;

  buried: boolean;

  dueDate: number;

  /**
   * Turn this card back into a new card.
   */
  forget(): void;

  /**
   * Initialize the scheduler in a blank state.
   */
  init(): void;

  marked: boolean;

  /**
   * Redo your previous undo. Does nothing if you did not previously undo a card.
   */
  redo(): void;

  reps: number;

  suspended: boolean;

  /**
   * Bury / unbury this card. Burying the card hides it from review until the next day.
   */
  toggleBury(): void;

  /**
   * Mark / unmark this card.
   */
  toggleMark(): void;

  /**
   * Suspend / unsuspend this card. Suspending the card hides it from review until you unsuspend it.
   */
  toggleSuspend(): void;

  /**
   * Undo the previous answer to this card. Up to 20 answers are kept in the history. Does nothing if nothing is present in the history.
   */
  undo(): void;
}

export default Scheduler;
