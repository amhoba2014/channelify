/**
 * Represents a Receiver class.
 */
export default class Receiver<T> {
  private val: T;
  private isAdded: boolean;
  private err: Error | null;
  private cb: ((err: Error | null) => void) | null;
  private isDone: boolean;

  /**
   * Initialize a `Receiver`.
   *
   * @param val - The value to be received
   */
  constructor(val: T) {
    this.val = val;
    this.isAdded = false;
    this.err = null;
    this.cb = null;
    this.isDone = false;
  }

  /**
   * Call the callback if the pending add is complete.
   *
   * @private
   */
  private attemptNotify(): void {
    if ((this.isAdded || this.err) && this.cb && !this.isDone) {
      this.isDone = true;
      setImmediate(() => {
        if (this.cb) {
          this.cb(this.err);
        }
      });
    }
  }

  /**
   * Reject the pending add with an error.
   *
   * @param err - The error to reject with
   */
  error(err: Error): void {
    this.err = err;
    this.attemptNotify();
  }

  /**
   * Get the `val` and set the state of the value to added
   *
   * @returns The value
   */
  add(): T {
    this.isAdded = true;
    this.attemptNotify();
    return this.val;
  }

  /**
   * Register the callback.
   *
   * @param cb - The callback function
   */
  callback(cb: (err: Error | null) => void): void {
    this.cb = cb;
    this.attemptNotify();
  }
}
