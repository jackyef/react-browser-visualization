import React, { useState, useEffect, useRef } from 'react';
import { get } from 'lodash';
import {
  Container,
  visualizerContainer,
  callStackClass,
  userAction,
  TaskBlock,
  row,
  column,
  backgroundBlue,
  backgroundPurple,
  backgroundOrange,
  backgroundGreen,
  backgroundRed,
  callQueueClass,
  QueueTaskBlock,
  fillRemaining,
  LoopImage,
  flexCenter,
  width400,
} from './styles';

import refreshIcon from './assets/refresh-button.svg';

const createTask = (type = 'basic', title = '') => {
  let color;

  switch (type) {
    case 'basic':
      title = title || 'Basic Task';
      color = '#22a559';
      break;
    case 'timeout':
    case 'timeoutCallback':
      title = title || 'setTimeout(callback)';
      color = '#154ca5';
      break;
    case 'event':
    case 'eventCallback':
    case 'eventRemove':
      title = title || 'button.onClick(cb)';
      color = '#e87700';
      break;
    case 'render':
      title = title || 'frame #1';
      color = '#700591';
      break;
  }

  return {
    type,
    title,
    color,
  };
};

const RuntimeVizView = () => {
  const [callStack, setCallStack] = useState([createTask('basic')]);
  const [callbackStack, setCallbackStack] = useState([]);
  const [environmentStack, setEnvironmentStack] = useState([]);
  const [renderQueue, setRenderQueue] = useState([
    createTask('render', 'frame #1'),
    createTask('render', 'frame #2'),
    createTask('render', 'frame #3'),
    createTask('render', 'frame #4'),
    createTask('render', 'frame #5'),
    createTask('render', 'frame #6'),
    createTask('render', 'frame #7'),
  ]);
  const [tickSpeed, setTickSpeed] = useState(300);
  const [tickCount, setTickCount] = useState(0);
  const tickTimeoutRef = useRef(null);
  const [renderSpeed, setRenderSpeed] = useState(400);
  console.log('render', { callStack, callbackStack, environmentStack });
  
  const addTask = (type = 'basic', stack = 'call', title = '', number = 1) => {
    const createdTask = [];

    for (let i = 0; i < number; i++) {
      createdTask.push(createTask(type, title));
    }

    if (stack === 'call') {
      setCallStack([...callStack, ...createdTask]);
    } else if (stack === 'callback') {
      setCallbackStack([...callbackStack, ...createdTask]);
    } else {
      setEnvironmentStack([...environmentStack, ...createdTask]);
    }

    clearTimeout(tickTimeoutRef.current);
    tickTimeoutRef.current = null;
  };

  const processTick = () => {
    const clonedCallStack = [...callStack];
    const clonedEnvironmentStack = [...environmentStack];
    const clonedCallbackStack = [...callbackStack];
    const clonedRenderQueue = [...renderQueue];
    let shouldContinue = true;
    let shouldRender = true;
    let shouldOnlyRender = tickCount % 4 !== 0;

    let shiftedCallStackTask;

    console.log('tick count', tickCount);
    
    /*
      1 2 3 4 5 6 7 8 9 10 11 12

      anggap 1 tick = 4ms
      coba masukin render task ke main thread tiap 4 tick
    */

    let tryToEnqueueRenderTask = tickCount % 4 === 0;
    let frameDropped = false;
    const isCallStackEmpty = callStack.length < 1;

    if (tryToEnqueueRenderTask) {
      // take out next frame render task
      const shiftRenderQueue = clonedRenderQueue.shift();

      // generate task for next frame
      const newFrameNumber = Number(clonedRenderQueue[clonedRenderQueue.length - 1].title.split('#')[1]) + 1;

      clonedRenderQueue.push(createTask('render', `frame #${newFrameNumber}`));

      if (isCallStackEmpty) {
        // enqueue render to main thread
        clonedCallStack.push(createTask('render', `render ${shiftRenderQueue.title}`));

      } else {
        // drop frame
        frameDropped = true;
      }
    } 

    // move timeouts from environment thread to callback stack
    const removedEnvironmentTaskIndex = clonedEnvironmentStack.findIndex(task => task.type !== 'event');
    const removedEnvironmentTask = clonedEnvironmentStack[removedEnvironmentTaskIndex];

    if (removedEnvironmentTask) {
      const { type } = removedEnvironmentTask;

      clonedEnvironmentStack.splice(removedEnvironmentTaskIndex, 1); 
      clonedCallbackStack.push(createTask(`${type}Callback`, `${type === 'event' ? 'click' : type}Callback()`));
    }
    
    if (!tryToEnqueueRenderTask || frameDropped){
      // only do this if we are not trying to enqueue render task
      // do the usual process
      // 1. Take oldest task from the main thread
      shiftedCallStackTask = clonedCallStack.shift();

      if (shiftedCallStackTask) {
        const { type } = shiftedCallStackTask;

        if (type === 'render' || type === 'basic') {
          // do nothing, we only need to pop it
        } else {
          // could be setTimeout or creating eventListener, or remove event listener
          if (type === 'eventRemove') {
            // if it's to remove event listener, we remove one eventListener in current environment stack
            const index = clonedEnvironmentStack.findIndex(task => task.type === 'event');

            if (index > -1) {
              clonedEnvironmentStack.splice(index, 1);
            }    
          } else if (type.indexOf('Callback') < 0) {
            // if it isn't callback
            // queue it to the environment thread to handle it
            clonedEnvironmentStack.push(createTask(type));
          }
        }
      }

      // 2. enqueue task from callback task to main thread, if it's empty at the start at this tick
      if (isCallStackEmpty) {
        const shiftedCallbackStack = clonedCallbackStack.shift();
        
        if (shiftedCallbackStack) {
          const { type } = shiftedCallbackStack;
  
          clonedCallStack.push(createTask(type, `${type}()`));
        }
      }
    }

    // if (shouldOnlyRender) {
    //   if (get(clonedCallStack, '[0].type') === 'render') {
    //     poppedCallStack = clonedCallStack.pop();
    //   }
    // } else {
    //   poppedCallStack = clonedCallStack.pop();
    // }

    // const isCallStackEmpty = callStack.length < 1;
    
    // if (poppedCallStack) {
    //   const { type } = poppedCallStack;
  
    //   if (type === 'event' || type === 'timeout') {
    //     // add to environment thread, let env handle the task
    //     clonedEnvironmentStack.push(createTask(type));
    //   }

    //   if (type === 'eventRemove') {
    //     // remove one eventListener from env thread
    //     const index = clonedEnvironmentStack.findIndex(task => task.type === 'event');

    //     if (index > -1) {
    //       clonedEnvironmentStack.splice(index, 1);
    //     }
    //   }

    //   if (type === 'render') {
    //     shouldRender = false;
    //   }
    // }

    // if (shouldRender) {
    //   const shiftRenderQueue = clonedRenderQueue.shift();
    //   const newFrameNumber = Number(clonedRenderQueue[clonedRenderQueue.length - 1].title.split('#')[1]) + 1;
  
    //   clonedRenderQueue.push(createTask('render', `frame #${newFrameNumber}`));
  
    //   if (isCallStackEmpty && shouldContinue) {
    //     // if call stack is empty, move one task from render queue to call stack
    //     clonedCallStack.push(createTask('render', `render ${shiftRenderQueue.title}`));
    //     shouldContinue = false;
    //   }
    // }

    // if (!shouldOnlyRender) {
    //   if (isCallStackEmpty && shouldContinue) {
    //     // if call stack is empty, move one task from callback queue to call stack
    //     const poppedCallbackStack = clonedCallbackStack.pop();
        
    //     if (poppedCallbackStack) {
    //       const { type } = poppedCallbackStack;
  
    //       clonedCallStack.push(createTask(type, `${type}()`));
    //       shouldContinue = false;
    //     }
    //   }
    // }

    // if (isCallStackEmpty && shouldContinue) {
    //   // assume that timeout triggered,
    //   // move task from environment stack to callback stack
    //   const poppedEnvironmentStackIndex = clonedEnvironmentStack.findIndex(task => task.type !== 'event');
    //   const poppedEnvironmentStack = clonedEnvironmentStack[poppedEnvironmentStackIndex];

    //   if (poppedEnvironmentStack) {
    //     const { type } = poppedEnvironmentStack;

    //     clonedEnvironmentStack.splice(poppedEnvironmentStackIndex, 1); 
    //     clonedCallbackStack.push(createTask(`${type}Callback`, `${type === 'event' ? 'click' : type}Callback()`));
    //     shouldContinue = false;
    //   }
    // }

    setCallStack(clonedCallStack);
    setCallbackStack(clonedCallbackStack);
    setEnvironmentStack(clonedEnvironmentStack);
    setRenderQueue(clonedRenderQueue);
    setTickCount(tickCount + 1);
   
    console.log('tick processed');
    // set next tick
    clearTimeout(tickTimeoutRef.current);
    tickTimeoutRef.current = null;
    // setTickTimeout(null);
  }

  useEffect(() => {
    if (!tickTimeoutRef.current) {
      tickTimeoutRef.current = setTimeout(processTick, tickSpeed);
      // console.log('ticktimeout set', { timeout: tickTimeoutRef.current, tickSpeed });
    } else {
      // console.log('not setting ticktimeout', { timeout: tickTimeoutRef.current, tickSpeed });
    }

    return () => {
      if (!tickTimeoutRef.current) {
        clearTimeout(tickTimeoutRef.current);
        tickTimeoutRef.current = null;
      }
    };
  });

  const handleOurButtonClick = () => {
    const numberOfListeners = environmentStack.filter(task => task.type === 'event').length;

    addTask('eventCallback', 'callback', 'clickCallback()', numberOfListeners);
  }

  return (
    <Container>
      <h1>Browser process visualization</h1>
      <div className={visualizerContainer}>
        <div className={row}>
          <div className={userAction}>
            <button className={backgroundGreen} onClick={() => addTask('basic', 'call')}>
              Add Basic Task
            </button>
            <button className={backgroundBlue} onClick={() => addTask('timeout', 'call', 'setTimeout(callback)')}>
              Add <code>setTimeout(callback)</code>
            </button>
            <button className={backgroundOrange} onClick={() => addTask('event', 'call', 'button.onClick(cb)')}>
              Add onClick listener to button
            </button>
            <button className={backgroundOrange} onClick={() => addTask('eventRemove', 'call', 'button.removeOnClick(cb)')}>
              Remove onClick listener to button
            </button>
            <code>----------------</code><br/>
            <button className={backgroundRed} onClick={handleOurButtonClick}>
              Our button
            </button>
          </div>
          <div className={`${column} ${width400}`}>
            <div>Main Thread</div>
            <div className={callStackClass}>
              {callStack.map((task, i) => (
                <TaskBlock key={i} color={task.color}>
                  <code>{task.title}</code>
                </TaskBlock>
              ))}
            </div>
          </div>

          <div className={`${column} ${fillRemaining}`}>
            <div>Environment Thread</div>
            <div className={callQueueClass}>
              {environmentStack.map((task, i) => (
                <QueueTaskBlock key={i} color={task.color}>
                  <code>{task.title}</code>
                </QueueTaskBlock>
              ))}
            </div>
            <div>Callback queue</div>
            <div className={callQueueClass}>
              {callbackStack.map((task, i) => (
                <QueueTaskBlock key={i} color={task.color}>
                  <code>{task.title}</code>
                </QueueTaskBlock>
              ))}
            </div>
            <div className={flexCenter}>
              <LoopImage src={refreshIcon} animating rotateSpeed={tickSpeed} />
              <code>Event Loop</code>
            </div>
            <div>Render queue</div>
            <div className={callQueueClass}>
              {renderQueue.map((task, i) => (
                <QueueTaskBlock key={i} color={task.color}>
                  <code>{task.title}</code>
                </QueueTaskBlock>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default RuntimeVizView;
