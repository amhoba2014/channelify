import { timeout } from '../src'; // Adjust import path as necessary
import { expect } from 'chai';
import sinon from 'sinon';

describe('Timeout channel make', () => {
  it('should return a function', () => {
    const to = timeout(500);
    expect(to).to.be.a('function');
  });

  it('should call the callback after a number of ms', () => {
    const clock = sinon.useFakeTimers();
    const cb = sinon.spy();
    const ms = 500;
    const to = timeout(ms);

    to(cb);

    // Advance time just before the timeout
    clock.tick(ms - 1);
    expect(cb.called).to.be.false;

    // Advance time to the exact timeout duration
    clock.tick(1);
    expect(cb.called).to.be.true;

    clock.restore();
  });
});
