// src/Channel.ts
export class Channel<T> {
  private queue: T[] = [];
  private closed = false;
  private resolveQueue: ((value: T) => void)[] = [];

  constructor(private bufferSize: number = 0) { }

  // Send a value into the channel
  async send(value: T): Promise<void> {
    if (this.closed) {
      throw new Error("Channel is closed");
    }

    if (this.queue.length < this.bufferSize) {
      this.queue.push(value);
      this._resolveNext();
    } else {
      await new Promise<void>((resolve) => this.resolveQueue.push(resolve as any));
      this.send(value);
    }
  }

  // Receive a value from the channel
  async receive(): Promise<T> {
    if (this.queue.length > 0) {
      return this.queue.shift()!;
    }

    if (this.closed) {
      throw new Error("Channel is closed and empty");
    }

    return new Promise<T>((resolve) => {
      this.resolveQueue.push(resolve);
    });
  }

  // Close the channel
  close() {
    this.closed = true;
    this.resolveQueue.forEach((resolve) => resolve(undefined as any));
  }

  // Check if the channel is closed
  isClosed() {
    return this.closed;
  }

  // Resolve the next waiting consumer
  private _resolveNext() {
    if (this.resolveQueue.length > 0 && this.queue.length > 0) {
      const resolve = this.resolveQueue.shift()!;
      resolve(this.queue.shift()!);
    }
  }
}
