import { SEND_MESSAGE } from "../actions"

const chatMessages = (state = [], action) => {
  switch (action.type) {
    case SEND_MESSAGE:
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false
        }
      ]
    default:
      return state
  }
}

export default chatMessages