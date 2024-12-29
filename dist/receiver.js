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
exports.Receiver = void 0;
// src/Receiver.ts
class Receiver {
    constructor(channel, callback, errorCallback) {
        this.channel = channel;
        this.callback = callback;
        this.errorCallback = errorCallback;
    }
    // Start receiving from the channel
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                while (!this.channel.isClosed()) {
                    const value = yield this.channel.receive();
                    this.callback(value);
                }
            }
            catch (error) {
                this.errorCallback(error);
            }
        });
    }
}
exports.Receiver = Receiver;
