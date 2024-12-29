import { Receiver } from './receiver';

/**
 * Error message for operations on a closed channel.
 */
const CLOSED_ERROR_MSG = 'Cannot add to closed channel';

/**
 * Represents a Go-style channel.
 */
export class Channel<T> {
  private buffer: T[] = [];
  private pendingAdds: Receiver<T>[] = [];
  private pendingGets: Array<(value: T | undefined) => void> = [];
  private bufferSize: number;
  private isClosed: boolean = false;
  private isDone: boolean = false;

  constructor(bufferSize: number = 0) {
    this.bufferSize = bufferSize;
  }

  /**
   * Retrieve a value from the channel.
   * Resolves once a value is available or the channel is closed.
   */
  async get(): Promise<T | undefined> {
    if (this.isDone) {
      return undefined;
    }

    if (this.buffer.length > 0) {
      return this.buffer.shift();
    }

    return new Promise<T | undefined>((resolve) => {
      this.pendingGets.push(resolve);
    });
  }

  /**
   * Add a value to the channel.
   * Resolves once the value is successfully added.
   */
  async add(value: T): Promise<void> {
    if (this.isClosed) {
      throw new Error(CLOSED_ERROR_MSG);
    }

    if (this.pendingGets.length > 0) {
      const resolve = this.pendingGets.shift();
      resolve?.(value);
    } else if (this.buffer.length < this.bufferSize) {
      this.buffer.push(value);
    } else {
      const receiver = new Receiver(value);
      this.pendingAdds.push(receiver);
      await receiver.completion();
    }
  }

  /**
   * Close the channel to further additions.
   */
  close(): void {
    this.isClosed = true;
    this.completePendingAdds();
    this.completePendingGets();
  }

  /**
   * Check if the channel is fully completed.
   */
  isComplete(): boolean {
    return this.isDone;
  }

  /**
   * Complete all pending additions with an error.
   */
  private completePendingAdds(): void {
    while (this.pendingAdds.length > 0) {
      const receiver = this.pendingAdds.shift();
      receiver?.error(new Error(CLOSED_ERROR_MSG));
    }
  }

  /**
   * Complete all pending gets with undefined.
   */
  private completePendingGets(): void {
    while (this.pendingGets.length > 0) {
      const resolve = this.pendingGets.shift();
      resolve?.(undefined);
    }
    this.isDone = true;
  }
}
