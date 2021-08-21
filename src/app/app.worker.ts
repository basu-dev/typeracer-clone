/// <reference lib="webworker" />
import { PlayObject } from "./pages/models/playobject.model";
import { WM, WorkerMessage } from "./workerMessage";




let val = 0;
let intervalSub: any;
let typingArray: PlayObject[] = [];
let currentObject!: PlayObject;

addEventListener('message', (message) => {
  let data = message.data;
  console.log(data);
  switch (message.type) {
    case WM.sendTypingArray$:
      setTypingArray(message.data);
      break;
    case WM.calculateScore$:
      setCurrentObject(message.data);
  }
});

const setTypingArray = (data: PlayObject[]) => typingArray = data;

const setCurrentObject = (data: PlayObject) => currentObject = data;

function calculateScore() {
  intervalSub = setInterval(() => {
    postMessage(val++);
  });
}
