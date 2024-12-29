import { make } from './make';
import { Channel } from './channel';

/**
 * Select the first channel that provides a value or resolves.
 * 
 * @param {Channel<any>} channels - A list of channels to select from.
 * @returns {Channel<Channel<any>>} - A channel that will contain the selected channel.
 */
export function select(...channels: Channel<any>[]): Channel<Channel<any>> {
  const selectCh = make<Channel<any>>(channels.length);
  const full = channels.filter((ch) => ch.buffer.length > 0 || ch.pendingAdds.length > 0);
  let remaining = channels.length;

  const get = (err: Error | null, value: any): void => {
    const ch = Channel.lastCalled;

    if (value === ch.empty && --remaining > 0) {
      return;
    }

    channels.forEach((ch) => ch.removeGet(get));

    selectCh.add(ch).catch(() => selectCh.close());
  };

  if (full.length > 1) {
    full[Math.floor(Math.random() * full.length)].get().then(get);
  } else {
    channels.forEach((ch) => ch.get().then(get));
  }

  return selectCh;
}
