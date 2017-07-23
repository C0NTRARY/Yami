import React from 'react'
import PropTypes from 'prop-types'

const ChatMessage = ({ text }) => (
  <li>{text}</li>
)

ChatMessage.propTypes = {
  text: PropTypes.string.isRequired
}

export default ChatMessage