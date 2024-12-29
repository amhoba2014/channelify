import { expect } from 'chai';
import sinon from 'sinon';
import { async } from '../src/async'; // Adjust the import path if necessary

describe('Async helper', () => {
  let err: unknown;
  let val: unknown;
  let ch: sinon.SinonStub;
  let fn: sinon.SinonStub;

  beforeEach(() => {
    err = {};
    val = {};
    ch = sinon.stub().returns((cb: Function) => cb());
    fn = sinon.stub().yields(err, val);
  });

  it('should return a function with an arity of 1', () => {
    const thunk = async(ch as any, fn);
    expect(thunk).to.be.a('function');
    expect(thunk.length).to.equal(1);
  });

  it('should call fn with args plus a callback', () => {
    async(ch, fn, 1, 2, 3, 'foo');
    const argsWithoutCb = fn.firstCall.args.slice(0, -1);
    expect(argsWithoutCb).to.eql([1, 2, 3, 'foo']);
  });

  it('should call a method of an object with the third argument as the name', () => {
    const ob = { foo: fn };
    async(ch, ob, 'foo', 1, 2, 3);
    const argsWithoutCb = fn.firstCall.args.slice(0, -1);
    expect(argsWithoutCb).to.eql([1, 2, 3]);
    expect(fn.firstCall.calledOn(ob)).to.be.true;
  });

  it('should call channel with arguments of the async function callback', () => {
    async(ch, fn);
    expect(ch.firstCall.args.length).to.equal(2);
    expect(ch.firstCall.args[0]).to.equal(err);
    expect(ch.firstCall.args[1]).to.equal(val);
  });

  it('should call callback given to returned function', (done) => {
    const cb = sinon.spy();
    async(ch, fn)(cb);
    setImmediate(() => {
      expect(cb.callCount).to.equal(1);
      done();
    });
  });
});
