import { Channel } from './channel';

/**
 * Create a new channel with an optional buffer size.
 *
 * @param {number} [bufferSize=0] - The buffer size of the channel.
 * @returns {Channel<T>} - A new channel instance.
 */
export function make<T>(bufferSize: number = 0): Channel<T> {
  return new Channel<T>(bufferSize);
}
