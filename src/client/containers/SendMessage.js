import React from 'react'
import { connect } from 'react-redux'
import { sendMessage } from '../actions'

let SendMessage = ({ dispatch }) => {
  let input

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.value.trim()) {
          return
        }
        dispatch(sendMessage(input.value))
        input.value = ''
      }}>
        <input ref={node => {
          input = node
        }} />
        <button type="submit">
          Send
        </button>
      </form>
    </div>
  )
}
SendMessage = connect()(SendMessage)

export default SendMessage