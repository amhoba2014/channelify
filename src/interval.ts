import { Channel } from './channel';

/**
 * Create an interval channel that emits a count at the specified interval.
 *
 * @param {number} ms - Interval time in milliseconds.
 * @returns {Channel<number>} - A channel that emits incrementing counts.
 */
export function intervalChan(ms: number): Channel<number> {
  const ch = new Channel<number>();
  let count = 0;

  const intervalId = setInterval(() => {
    if (ch.isComplete()) {
      clearInterval(intervalId);
    } else {
      ch.add(++count).catch(() => clearInterval(intervalId));
    }
  }, ms);

  return ch;
}
