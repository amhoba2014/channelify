/**
 * Channel interface defining the structure of a channel.
 */
export interface Channel<T> {
  (value?: T | null, callback?: Function): void;
  close(): void;
  done(): boolean;
  empty: any;
  __chan: ChannelImplementation<T>;
  async: (fn: Function, ...args: any[]) => Function;
}

/**
 * Internal implementation of a channel.
 */
export interface ChannelImplementation<T> {
  pendingAdds: Array<Receiver<T>>;
  pendingGets: Array<Function>;
  items: Array<T>;
  bufferSize: number;
  isClosed: boolean;
  isDone: boolean;
  empty: any;
  get(callback: Function): void;
  add(value: T): Function;
  call(callback: Function, value: any): void;
  removeGet(callback: Function): void;
  close(): void;
  done(): boolean;
}
