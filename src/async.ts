/**
 * Module dependencies.
 */
import Receiver from './receiver';

/**
 * Expose `async`.
 */
export default async;

/**
 * Add value to channel via node-style async function.
 *
 * @param ch - Channel function
 * @param fn - Async function or object with an async method
 * @param method - Name of the method if `fn` is an object
 * @param args - Async function arguments without callback
 * @returns Thunk function
 */
function async(
  ch: (err: Error | null, val: any) => (cb: (err: Error | null) => void) => void,
  fn: Function | Record<string, any>,
  ...args: any[]
): (cb: (err: Error | null) => void) => void {
  const receiver = new Receiver(args);
  let context: Record<string, any> | null = null;

  if (typeof fn === 'object') {
    context = fn;
    fn = fn[args.shift() as string];
  }

  args.push(function (err: Error | null, val: any) {
    if (arguments.length > 2) {
      val = Array.prototype.slice.call(arguments, 1);
    }
    ch(err, val)((error: Error | null) => {
      receiver[error ? 'error' : 'add'](error);
    });
  });

  fn.apply(context, args);

  return function (cb: (err: Error | null) => void) {
    receiver.callback(cb);
  };
}
