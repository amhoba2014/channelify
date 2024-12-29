import { expect } from 'chai';
import { chan } from '../src'; // Adjust the import path if necessary

describe('A closed channel', () => {
  it('should yield an error when attempting to add a value', () => {
    const ch = chan();
    ch.close();
    ch('foo')((err) => {
      expect(err).to.be.instanceOf(Error);
    });
  });

  describe('that has items in the buffer', () => {
    it('should return `false` when the `done()` method is called', () => {
      const ch = chan(1);
      ch('foo');
      ch.close();
      expect(ch.done()).to.be.false;
    });
  });

  describe('that is empty', () => {
    it('should invoke pending callbacks with an empty value', () => {
      const ch = chan();
      ch((err, value) => {
        expect(value).to.equal(ch.empty);
      });
      ch.close();
    });

    it('should return `true` when the `done()` method is called', () => {
      const ch = chan();
      ch.close();
      expect(ch.done()).to.be.true;
    });

    it('should immediately invoke any callback added with the empty value', () => {
      const ch = chan();
      ch.close();
      ch((err, value) => {
        expect(value).to.equal(ch.empty);
      });
    });
  });
});
