"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
// src/Channel.ts
class Channel {
    constructor(bufferSize = 0) {
        this.bufferSize = bufferSize;
        this.queue = [];
        this.closed = false;
        this.resolveQueue = [];
    }
    // Send a value into the channel
    send(value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.closed) {
                throw new Error("Channel is closed");
            }
            if (this.queue.length < this.bufferSize) {
                this.queue.push(value);
                this._resolveNext();
            }
            else {
                yield new Promise((resolve) => this.resolveQueue.push(resolve));
                this.send(value);
            }
        });
    }
    // Receive a value from the channel
    receive() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.queue.length > 0) {
                return this.queue.shift();
            }
            if (this.closed) {
                throw new Error("Channel is closed and empty");
            }
            return new Promise((resolve) => {
                this.resolveQueue.push(resolve);
            });
        });
    }
    // Close the channel
    close() {
        this.closed = true;
        this.resolveQueue.forEach((resolve) => resolve(undefined));
    }
    // Check if the channel is closed
    isClosed() {
        return this.closed;
    }
    // Resolve the next waiting consumer
    _resolveNext() {
        if (this.resolveQueue.length > 0 && this.queue.length > 0) {
            const resolve = this.resolveQueue.shift();
            resolve(this.queue.shift());
        }
    }
}
exports.Channel = Channel;
