import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import ChatMessageList from '../components/ChatMessageList'

const mapStateToProps = (state) => ({
  chatMessages: state.chatMessages
})

const ChatBox = connect(
  mapStateToProps,
  {}
)(ChatMessageList)

export default ChatBox