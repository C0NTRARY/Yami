import fetch from 'isomorphic-fetch';
import { socket } from '../.';

export const SEND_MESSAGE = 'SEND_MESSAGE';
export const UPLOAD_MESSAGE = 'UPLOAD_MESSAGE';
let messageId = 0;

let nextMessageId = 0

export function sendMessage(text){
  return dispatch => {
    dispatch(uploadMessage(text));
    return socket.emit('message', { message: text });
  }
}

export function uploadMessage(text){
  return {
    type: UPLOAD_MESSAGE,
    text: text,
    id: messageId++
  }
}