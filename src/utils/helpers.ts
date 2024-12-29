/**
 * A utility function to create a delayed promise.
 * 
 * @param {number} ms - The delay in milliseconds.
 * @returns {Promise<void>} - A promise that resolves after the given delay.
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * A utility function to generate a unique ID.
 * 
 * @returns {string} - A unique ID string.
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
