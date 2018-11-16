export default function() {
  this.count = 0;
  this.addEventListener("message", e => {

    for (let i = 0; i < 1000000000; i++) {
      this.count += 1;
    }

    postMessage({ count: this.count });
  });
}
