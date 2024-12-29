// src/index.ts
import { Channel } from './channel';
import { Receiver } from './receiver';
import { intervalChan } from './intervalchan';

async function main() {
  const channel = new Channel<number>(2); // Buffered channel with size 2

  // Example of sending and receiving values
  channel.send(1);
  channel.send(2);
  
  const receiver = new Receiver<number>(
    channel, 
    (value) => console.log('Received:', value),
    (error) => console.error('Error:', error)
  );
  
  receiver.start();

  await channel.send(3); // This will be processed after receiving 1 and 2

  setTimeout(() => {
    channel.close();
  }, 2000); // Close channel after 2 seconds
}

// Example of using interval channel
async function runInterval() {
  const intervalChannel = intervalChan(1000, 5);
  const intervalReceiver = new Receiver<number>(
    intervalChannel,
    (value) => console.log('Interval value:', value),
    (error) => console.error('Interval error:', error)
  );

  intervalReceiver.start();
}

main();
runInterval();
