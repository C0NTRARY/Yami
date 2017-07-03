import React from 'react'
import PropTypes from 'prop-types'

const ChatMessage = ({ completed, text }) => (
  <li
    style={{
      textDecoration: completed ? 'line-through' : 'none'
    }}
  >
    {text}
  </li>
)

ChatMessage.propTypes = {
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
}

export default ChatMessage