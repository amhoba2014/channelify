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
// src/index.ts
const channel_1 = require("./channel");
const receiver_1 = require("./receiver");
const intervalchan_1 = require("./intervalchan");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = new channel_1.Channel(2); // Buffered channel with size 2
        // Example of sending and receiving values
        channel.send(1);
        channel.send(2);
        const receiver = new receiver_1.Receiver(channel, (value) => console.log('Received:', value), (error) => console.error('Error:', error));
        receiver.start();
        yield channel.send(3); // This will be processed after receiving 1 and 2
        setTimeout(() => {
            channel.close();
        }, 2000); // Close channel after 2 seconds
    });
}
// Example of using interval channel
function runInterval() {
    return __awaiter(this, void 0, void 0, function* () {
        const intervalChannel = (0, intervalchan_1.intervalChan)(1000, 5);
        const intervalReceiver = new receiver_1.Receiver(intervalChannel, (value) => console.log('Interval value:', value), (error) => console.error('Interval error:', error));
        intervalReceiver.start();
    });
}
main();
runInterval();
