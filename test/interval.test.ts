import { interval } from '../src'; // Adjust the import path if necessary
import { expect } from 'chai';
import sinon from 'sinon';

describe('Interval channel make', () => {
  it('should return a function', () => {
    const int = interval(500);
    expect(int).to.be.a('function');
  });

  it('should call the callback after a number of milliseconds', () => {
    const clock = sinon.useFakeTimers();
    const cb = sinon.spy();
    const ms = 500;
    const int = interval(ms);
    int(cb);

    // Simulate time just before the interval duration
    clock.tick(ms - 1);
    expect(cb.called).to.be.false;

    // Simulate the remaining time to reach the interval
    clock.tick(1);
    expect(cb.called).to.be.true;

    clock.restore(); // Restore the original timers
  });

  it('should call the callback again after the interval duration', () => {
    const clock = sinon.useFakeTimers();
    const cb = sinon.spy();
    const ms = 500;
    const int = interval(ms);
    int(cb);

    // Simulate multiple intervals
    clock.tick(ms);
    expect(cb.calledOnce).to.be.true;

    clock.tick(ms);
    expect(cb.calledTwice).to.be.true;

    clock.restore(); // Restore the original timers
  });
});
