import { make } from '../make';

// Create a channel
const chan = make<number>();

// Add a value to the channel
chan(42);

// Get the value from the channel
chan((err, value) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Received value:', value);
  }
});
