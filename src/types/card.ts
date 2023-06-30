interface Card {
  /**
   * Returns the timestamp for the due date of this card.
   * @param response - A value among 'again', 'easy', 'hard', 'good' or 1, 2, 3, 4
   */
  answer(response: string): number;

  buried: boolean;

  dueDate: number;

  marked: boolean;

  meanings: object;

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
}

export default Card;
