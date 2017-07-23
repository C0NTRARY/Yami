import { SEND_MESSAGE, UPLOAD_MESSAGE } from "../actions"

const chatMessages = (state = [], action) => {
  switch (action.type) {
    case UPLOAD_MESSAGE:
      return [
        ...state,
        {
          id: action.id,
          text: action.text
        }
      ]
    default:
      return state
  }
}

export default chatMessages