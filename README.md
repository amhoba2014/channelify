# channelify

`channelify` is a JavaScript/TypeScript implementation of a Go-like channel system for managing asynchronous operations. Inspired by Golang’s concurrency model, it provides a way to handle communication between different parts of an application, particularly in scenarios where multiple asynchronous tasks need to be managed in an orderly and non-blocking manner. 

The core concept revolves around channels, which are used to send and receive data asynchronously, allowing for smoother handling of tasks like I/O operations, timeouts, and more.

## Features

- **Buffered and Unbuffered Channels**: Allows you to choose between buffered channels (with a fixed size) and unbuffered channels (which provide immediate communication).
- **Receiver Class**: Handles the state of values being sent to the channel, invoking corresponding callbacks on successful reception or error.
- **Interval Channels**: Supports creating channels that emit values at regular intervals.
- **Graceful Closing**: Channels can be closed to prevent further values from being added.
- **Concurrency Model**: Provides a way to handle asynchronous tasks similarly to Go's concurrency model, with seamless support for modern JavaScript features like Promises and async/await.

## Installation

To install `channelify`, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/yourusername/channelify.git
cd channelify
```

2. Install dependencies using npm:

```bash
npm install
```

3. Build the TypeScript files:

```bash
npm run build
```

3. Run the project:

```bash
npm start
```

## Usage

### Creating a Channel

The `Channel` class is the core of the `channelify` library. It provides the functionality for asynchronous communication between different parts of your application.

```typescript
import { Channel } from 'channelify';

// Create a buffered channel with a size of 2
const channel = new Channel<number>(2);
```

### Sending and Receiving Values

You can send and receive values through the channel using the `send` and `receive` methods.

```typescript
// Sending a value into the channel
await channel.send(1);

// Receiving a value from the channel
const value = await channel.receive();
console.log(value);  // Output: 1
```

### Receiver Class

The `Receiver` class is used to continuously receive values from a channel. You can define callback functions for successful value reception and error handling.

```typescript
import { Receiver } from 'channelify';

// Create a receiver to handle values and errors
const receiver = new Receiver<number>(
  channel,
  (value) => console.log('Received:', value), // Value received callback
  (error) => console.error('Error:', error)  // Error callback
);

// Start receiving values
receiver.start();
```

### Interval Channels

You can create an interval channel using the `intervalChan` function. This will create a channel that emits a value at regular intervals.

```typescript
import { intervalChan } from 'channelify';

const intervalChannel = intervalChan(1000, 5); // Sends a number every second, up to 5 times

const receiver = new Receiver<number>(
  intervalChannel,
  (value) => console.log('Interval value:', value),
  (error) => console.error('Error:', error)
);

receiver.start();
```

## Contributing

Contributions are welcome! If you find a bug, have a suggestion, or want to improve the project, feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Commit and push your changes
5. Create a pull request

## License

`channelify` is open-source software licensed under the MIT license. See the LICENSE file for more details.