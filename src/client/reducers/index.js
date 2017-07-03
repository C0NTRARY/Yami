import { combineReducers } from 'redux'
import chatMessages from './chatMessages'

const chatApp = combineReducers({
  chatMessages
})

export default chatApp