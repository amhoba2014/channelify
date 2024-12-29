/**
 * A receiver that handles channel values and errors.
 */
export class Receiver<T> {
  private value: T | undefined;
  private isAdded: boolean = false;
  private isDone: boolean = false;
  private callback: ((err?: Error) => void) | null = null;

  constructor(value: T | undefined) {
    this.value = value;
  }

  /**
   * Notify the receiver if it's been added or errored out.
   */
  private attemptNotify(): void {
    if ((this.isAdded || this.isDone) && this.callback) {
      this.isDone = true;
      setImmediate(() => this.callback!());
    }
  }

  /**
   * Handle errors for the receiver.
   */
  error(err: Error): void {
    this.isAdded = false;
    this.value = undefined;
    this.callback = () => { throw err };
    this.attemptNotify();
  }

  /**
   * Add the value and notify the receiver.
   */
  add(): T | undefined {
    this.isAdded = true;
    this.attemptNotify();
    return this.value;
  }

  /**
   * Register the callback to be invoked when the receiver is notified.
   */
  callback(cb: (err?: Error) => void): void {
    this.callback = cb;
    this.attemptNotify();
  }

  /**
   * Complete the receiver’s process.
   */
  complete(): void {
    this.isDone = true;
    this.attemptNotify();
  }
}
