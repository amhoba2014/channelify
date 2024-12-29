import { Receiver } from './receiver';
import { Channel } from './channel';

/**
 * Add value to channel via async function or object with async method.
 *
 * @param {Channel<any>} ch - The channel to send values to.
 * @param {Function | object} fn - Async function or object with an async method.
 * @param {string} [method] - Method name (only if fn is an object).
 * @param {...any} args - Arguments for the async function (without callback).
 * @returns {Promise<void>}
 */
export async function async<T>(
  ch: Channel<T>,
  fn: Function | Record<string, any>,
  method?: string,
  ...args: any[]
): Promise<void> {
  const receiver = new Receiver<T>();
  let context: any = null;

  if (typeof fn === 'object') {
    context = fn;
    fn = fn[method!];
  }

  try {
    const result = await fn.apply(context, args);
    await ch.add(result);
  } catch (error) {
    await ch.add(Promise.reject(error));
  } finally {
    receiver.complete();
  }
}
