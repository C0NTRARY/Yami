let nextMessageId = 0
export const sendMessage = (text) => ({
  type: 'SEND_MESSAGE',
  id: nextMessageId++,
  text
})