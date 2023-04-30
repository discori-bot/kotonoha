/**
 * Turns properties with the keys `K` in type `T` into optional properties.
 */
type Optional<T extends object, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export default Optional;
