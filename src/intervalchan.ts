import { Channel } from "./channel";

// src/intervalChan.ts
export function intervalChan(interval: number, max: number, channelBufferSize: number): Channel<number> {
  const channel = new Channel<number>(channelBufferSize);
  let count = 0;

  const intervalId = setInterval(() => {
    if (count >= max) {
      clearInterval(intervalId);
      channel.close();
    } else {
      channel.send(count++);
    }
  }, interval);

  return channel;
}
