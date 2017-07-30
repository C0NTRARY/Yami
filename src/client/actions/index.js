import fetch from 'isomorphic-fetch';
import { socket } from '../.';

export const SEND_MESSAGE = 'SEND_MESSAGE';
export const UPLOAD_MESSAGE = 'UPLOAD_MESSAGE';
export const RECIEVED_MESSAGE = 'RECIEVED_MESSAGE';
export const SEND_GEOLOCATION = 'SEND_GEOLOCATION';

let messageId = 0;

let nextMessageId = 0

export function sendMessage(text){
  return dispatch => {
    dispatch(uploadMessage(text));
    return socket.emit('addMessage', { message: text });
  }
}

export function uploadMessage(text){
  return {
    type: UPLOAD_MESSAGE,
    text: text,
    id: messageId++
  }
}

export function recievedMessage(text){
  return {
    type: RECIEVED_MESSAGE,
    text: text,
    id: messageId++
  }
}

export function sendGeolocation(position){
  return dispatch => {
    socket.emit('sendGeolocation', { latitude: position.coords.latitude, longitude: position.coords.longitude });
  }
}