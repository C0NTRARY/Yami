import fetch from 'isomorphic-fetch';

export const SEND_MESSAGE = 'SEND_MESSAGE';
export const UPLOAD_MESSAGE = 'UPLOAD_MESSAGE';

let nextMessageId = 0

export function sendMessage(text){
  return dispatch => {
    dispatch(uploadMessage(text));
    const messagePayload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
      },
      body: JSON.stringify({"text": text})
    };
    return fetch('http://localhost:3000/sendMessage', messagePayload)
      .catch(error => {throw error});
  }
}

export function uploadMessage(text){
  return {
    type: UPLOAD_MESSAGE,
    text
  }
}