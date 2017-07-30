import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { Provider } from 'react-redux'
import { recievedMessage, sendGeolocation } from './actions'
import App from './components/App'
import reducer from './reducers'
import io from 'socket.io-client'

export const socket = io('localhost:3000');
export const loggerMiddleware = createLogger()

const store = createStore(reducer, applyMiddleware(thunkMiddleware, loggerMiddleware));

const geolocation = window.navigator.geolocation.getCurrentPosition((position) => {
  console.log(JSON.stringify(position));
  store.dispatch(sendGeolocation(position));
});

socket.on('broadcastMessage', data => {
  store.dispatch(recievedMessage(data.message));
});

socket.on('previousMessage', data => {
  data.forEach(message => {
    store.dispatch(recievedMessage(message));
  });
});

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)