import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { Provider } from 'react-redux'
import App from './components/App'
import reducer from './reducers'
import io from 'socket.io-client'

export const socket = io('localhost:3000');
export const loggerMiddleware = createLogger()

const store = createStore(reducer, applyMiddleware(thunkMiddleware, loggerMiddleware))

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)