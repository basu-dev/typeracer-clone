import { Injectable } from '@angular/core';
import { WM } from '../workerMessage';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {

  constructor() { }

  private worker!: Worker;
  workerSupported = false;
  initWorker() {
    this.workerSupported = true;
    this.worker = new Worker(new URL('../app.worker', import.meta.url));
    this.worker.onmessage = ({ data }) => {
      console.log(`page got message: ${data}`);
    };
    // this.worker.postMessage('hello');
    this.postMessage(WM.startTimer$);
    setTimeout(() => this.postMessage(WM.endTimer$), 5000);

  }

  terminateWorker() {
    this.worker?.terminate();
  }

  postMessage<T>(type: WM, body?: T) {
    this.worker.postMessage({ body: { type, body } });
  }

  onMessage(type: WM, handler: () => {}) {
    this.worker.onmessage = (data: any) => {
      if (data.type == type) {
        handler();
      }
    };
  }
}
