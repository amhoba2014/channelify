import { expect } from 'chai';
import { chan } from '../src'; // Adjust the import path if necessary

describe('An unbuffered channel', () => {
  it('should not call the added callback until the value is removed', (done) => {
    const ch = chan(0); // unbuffered
    let cbCalled = false;

    ch('foo')(() => {
      cbCalled = true;
    });

    setImmediate(() => {
      expect(cbCalled).to.be.false;

      ch((err, val) => {
        setImmediate(() => {
          expect(cbCalled).to.be.true;
          done();
        });
      });
    });
  });
});

describe('A buffered channel', () => {
  it('should pull values from the buffer when yielded', (done) => {
    const ch = chan(1);
    let cbCalled = false;
    const testValue = 'foo';

    ch(testValue);
    ch((err, val) => {
      cbCalled = true;
      expect(val).to.equal(testValue);
    });

    setImmediate(() => {
      expect(cbCalled).to.be.true;
      done();
    });
  });

  describe('with a non-full buffer', () => {
    it('should call added callback as soon as it is given to the returned thunk', (done) => {
      const buffer = 3;
      const ch = chan(buffer);
      let called = 0;
      let added = 0;

      while (++added <= buffer + 10) {
        ch(added)((err) => {
          called++;
        });
      }

      setImmediate(() => {
        expect(called).to.equal(buffer);
        done();
      });
    });
  });

  describe('with a full buffer', () => {
    it('should not add another value until a value has been removed', (done) => {
      const ch = chan(1);
      let cbCalled = false;

      ch('foo');
      ch('bar')(() => {
        cbCalled = true;
      });

      setImmediate(() => {
        expect(cbCalled).to.be.false;

        ch((err, val) => {
          setImmediate(() => {
            expect(cbCalled).to.be.true;
            done();
          });
        });
      });
    });

    it('should call cb with an error when the channel is closed before adding', (done) => {
      const ch = chan(0);
      let cbCalled = false;

      ch('foo')((err) => {
        cbCalled = true;
        expect(err).to.be.instanceOf(Error);
      });

      ch.close();

      setImmediate(() => {
        expect(cbCalled).to.be.true;
        done();
      });
    });
  });
});
