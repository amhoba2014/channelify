import { chan, select } from '../src'; // Adjust import paths as needed
import { expect } from 'chai';

describe('Channel select', () => {
  let originalRandom: () => number;

  beforeEach((done) => {
    // Save Math.random
    originalRandom = Math.random;
    done();
  });

  afterEach((done) => {
    // Restore Math.random
    Math.random = originalRandom;
    done();
  });

  it('should be able to select on channels', (done) => {
    const ch1 = chan<number>();
    const ch2 = chan<number>();

    select(ch1, ch2)((err, selectedChannel) => {
      expect(selectedChannel).to.equal(ch2);

      ch2.selected((err, value) => {
        expect(value).to.equal(42);
        done();
      });
    });

    ch2(42);
  });

  it('should be able to select on multiple channels', (done) => {
    const channels = [chan<number>(), chan<number>()];
    let remaining = channels.length;

    channels.forEach((expectedChannel, i) => {
      select(...channels)((err, selectedChannel) => {
        expect(selectedChannel).to.equal(expectedChannel);

        selectedChannel.selected((err, value) => {
          expect(value).to.equal(i * 10);

          if (--remaining === 0) {
            done();
          }
        });
      });
    });

    channels.forEach((channel, i) => {
      channel(i * 10);
    });
  });

  it('should be able to select with queued messages', (done) => {
    const channels = [chan<number>(), chan<number>()];
    let remaining = 10;

    for (let i = 0; i < 10; i++) {
      select(...channels)((err, selectedChannel) => {
        expect(selectedChannel).to.equal(channels[0]);

        selectedChannel.selected((err, value) => {
          expect(value).to.equal(i * 10);

          if (--remaining === 0) {
            done();
          }
        });
      });
    }

    for (let i = 0; i < 10; i++) {
      channels[0](i * 10);
    }
  });

  it('should be able to select with existing messages on the channels', (done) => {
    const ch1 = chan<number>();
    const ch2 = chan<number>();

    ch2(42);

    select(ch1, ch2)((err, selectedChannel) => {
      expect(selectedChannel).to.equal(ch2);

      ch2.selected((err, value) => {
        expect(value).to.equal(42);
        done();
      });
    });
  });

  it('should randomly choose a channel to return with multiple full channels', (done) => {
    const ch1 = chan<number>();
    const ch2 = chan<number>();

    // Force the random selection to the second channel
    Math.random = () => 0.5;

    // Fill up both the channels
    ch1(21);
    ch2(42);

    select(ch1, ch2)((err, selectedChannel) => {
      expect(selectedChannel).to.equal(ch2);

      ch2.selected((err, value) => {
        expect(value).to.equal(42);
        done();
      });
    });
  });

  it('should wait for previously queued callbacks before selecting', (done) => {
    const ch1 = chan<number>();
    const ch2 = chan<number>();

    // Queue a callback for ch1
    ch1(() => {});

    select(ch1, ch2)((err, selectedChannel) => {
      expect(selectedChannel).to.equal(ch2);
      done();
    });

    ch1(74);
    ch2(47);
  });
});
