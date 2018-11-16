if (window.Worker) {
  window.WebWorker = class WebWorker {
    constructor(worker) {
      const code = worker.toString();
      const blob = new Blob([`(${code})()`]);
      
      return new Worker(URL.createObjectURL(blob));
    }
  };
}
