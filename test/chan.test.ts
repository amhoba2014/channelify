import { expect } from 'chai';
import { chan } from '../src'; // Adjust the import path if necessary
import fs from 'fs';

describe('Channel make', () => {
  it('should return a channel function', () => {
    const ch = chan();
    expect(ch).to.be.a('function');
  });
});

describe('A channel', () => {
  let ch: ReturnType<typeof chan>;

  beforeEach(() => {
    ch = chan();
  });

  it('should receive a value of any non-function type as the first argument', () => {
    const typeCases = [
      1,
      'foo',
      [1, 2, 3],
      { foo: 'bar' },
      true,
      false,
      null,
      undefined,
    ];

    typeCases.forEach((val) => {
      ch(val);
      ch((err, result) => {
        expect(result).to.equal(val);
      });
    });
  });

  it('should receive a function value as a second argument if the first is null', () => {
    ch(null, () => {});
    ch((err, result) => {
      expect(result).to.be.a('function');
    });
  });

  it('should queue values until they are yielded/removed', () => {
    const values = [1, 2, 3, 4, 5];

    values.forEach((value) => {
      ch(value);
    });

    values.forEach((value) => {
      ch((err, result) => {
        expect(result).to.equal(value);
      });
    });
  });

  it('should queue callbacks until values are added', () => {
    const values = [1, 2, 3, 4, 5];

    values.forEach((value) => {
      ch((err, result) => {
        expect(result).to.equal(value);
      });
    });

    values.forEach((value) => {
      ch(value);
    });
  });

  it('should pass errors as the first argument to callbacks', () => {
    const error = new Error('Foo');

    ch(error);
    ch((err) => {
      expect(err).to.equal(error);
    });
  });

  it('should be usable directly as a callback for node-style async functions', (done) => {
    ch((err, contents) => {
      expect(err).to.be.null;
      expect(contents).to.be.instanceOf(Buffer);
      done();
    });

    fs.readFile(__filename, ch);
  });
});
