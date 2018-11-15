export function triggerJank(ms = 2000) {
  for (let i = 0; i < ms * 100000; i++) {
    // do nothing, just loops
  }
}
