import { Channel } from "./channel";

// src/Receiver.ts
export class Receiver<T> {
  constructor(private channel: Channel<T>, private callback: (value: T) => void, private errorCallback: (error: Error) => void) {}

  // Start receiving from the channel
  async start() {
    try {
      while (!this.channel.isClosed()) {
        const value = await this.channel.receive();
        this.callback(value);
      }
    } catch (error) {
      this.errorCallback(error as Error);
    }
  }
}
