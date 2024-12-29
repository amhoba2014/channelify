import { make } from '../make';
import { select } from '../select';

// Create two channels
const chan1 = make<number>();
const chan2 = make<number>();

// Simulate some delay before adding values to the channels
setTimeout(() => chan1(1), 100);
setTimeout(() => chan2(2), 200);

// Use `select` to choose the first channel that has a value
select(chan1, chan2)((err, value) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Selected channel value:', value);
  }
});
