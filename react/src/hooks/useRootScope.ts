import { useState, useEffect } from 'react';

// Define the useRootScope hook
const useRootScope = () => {
  const [rootScope, setRootScope] = useState<any>({});

  // Example of setting a variable in rootScope
  const setVariable = (key: string, value: any) => {
    setRootScope((prevState: any) => ({
      ...prevState,
      [key]: value,
    }));
  };

  // Example of getting a variable from rootScope
  const getVariable = (key: string) => {
    return rootScope[key];
  };

  // Example of defining an event in rootScope
  const onEvent = (eventName: string, callback: Function) => {

    setRootScope((prevState: any) => {
      const newEventHandlers = {
        ...prevState.eventHandlers,
        [eventName]: callback,

    const event = new CustomEvent(eventName, { detail: data });
    window.dispatchEvent(event);
  };
      return {
        ...prevState,
        eventHandlers: newEventHandlers,
      };
    });
  };

  // Example of emitting an event in rootScope
  const emitEvent = (eventName: string, data: any) => {

    const event = new CustomEvent(eventName, { detail: data });
    window.dispatchEvent(event);
  };

  return {
    setVariable,
    getVariable,
    onEvent,
    emitEvent,
  };
};

export default useRootScope;
