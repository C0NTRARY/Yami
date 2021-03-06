import React from 'react'
import PropTypes from 'prop-types'
import ChatMessage from './ChatMessage'

const ChatMessageList = ({ chatMessages }) => (
  <ul>
    {chatMessages.map(chatMessage =>
      <ChatMessage
        key={chatMessage.id}
        {...chatMessage}
      />
    )}
  </ul>
)

ChatMessageList.propTypes = {
  chatMessages: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired
  }).isRequired).isRequired
}

export default ChatMessageList