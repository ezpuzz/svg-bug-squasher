import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import useRootScope from './hooks/useRootScope';

// Importing all the routes
import Home from './routes/Home';
import About from './routes/About';
import Contact from './routes/Contact';
import NotFound from './routes/NotFound';

const App: React.FC = () => {
  const { setVariable, getVariable, onEvent, emitEvent } = useRootScope();

  // Example usage of setVariable
  setVariable('exampleKey', 'exampleValue');

  // Example usage of getVariable
  const exampleValue = getVariable('exampleKey');
  console.log(exampleValue);

  // Example usage of onEvent
  onEvent('exampleEvent', (data: any) => {
    console.log('Event received:', data);
  });

  // Example usage of emitEvent
  emitEvent('exampleEvent', { message: 'Hello, World!' });

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default App;
