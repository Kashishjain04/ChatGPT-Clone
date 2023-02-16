import React from 'react'
import Chat from '../../../components/Chat'
import ChatInput from '../../../components/ChatInput'

const ChatPage = ({params: {id}}) => {
  
  return (
    <div className='flex flex-col h-screen overflow-hidden'>
      <Chat id={id} />
      <ChatInput id={id} />
    </div>
  )
}

export default ChatPage