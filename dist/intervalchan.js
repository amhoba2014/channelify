"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intervalChan = intervalChan;
const channel_1 = require("./channel");
// src/intervalChan.ts
function intervalChan(interval, max) {
    const channel = new channel_1.Channel();
    let count = 0;
    const intervalId = setInterval(() => {
        if (count >= max) {
            clearInterval(intervalId);
            channel.close();
        }
        else {
            channel.send(count++);
        }
    }, interval);
    return channel;
}
