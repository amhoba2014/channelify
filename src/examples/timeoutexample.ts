import { timeoutChan } from '../timeout';

// Create a timeout channel that will receive a value after 500 milliseconds
const timeout = timeoutChan(500);

// Handle the timeout channel
timeout((err, value) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Timeout completed:', value);
  }
});
