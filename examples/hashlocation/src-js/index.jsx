import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducer';
import View from './components/View';
import Router from './components/Router';
const store = createStore(reducer);
ReactDOM.render(<Provider store={store}>
    <Router />
    <View />
  </Provider>, document.getElementById('app'));
