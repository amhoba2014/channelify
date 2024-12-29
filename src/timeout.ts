import { make } from './make';

/**
 * Create a timeout channel that resolves after a specified timeout.
 * 
 * @param {number} ms - The timeout duration in milliseconds.
 * @returns {Channel<boolean>} - A channel that resolves with true after the timeout.
 */
export function timeoutChan(ms: number): Channel<boolean> {
  const ch = make<boolean>();

  setTimeout(() => {
    try {
      ch.add(true);
      ch.close();
    } catch (err) {
      ch.add(false);  // Ensure a value is added even if there was an error.
      ch.close();
    }
  }, ms);

  return ch;
}
