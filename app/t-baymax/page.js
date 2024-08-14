"use client";

import { Box, Button, CircularProgress, Fab, IconButton, LoadingButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Delete, Send, SendRounded } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const { push } = useRouter();

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am T-Baymax. Your personal healthcare companion! How are you feeling?"
    },
  ])

  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;  // Don't send empty messages
    setIsLoading(true)

    // setMessage('')  // Clear the input field

    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },  // Add the user's message to the chat
      { role: 'assistant', content: '' },  // Add a placeholder for the assistant's response
    ])

    try {
      console.log(message)
      console.log(JSON.stringify([...messages, { role: 'user', content: message }]))
      
      const options = {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...(messages || []), { role: 'user', content: message }]),
        
      }
      // Send the message to the server
      const response = await fetch('/api/chat', options)

      console.log("<Response>", response)
      console.log("<Response.body>", response.body)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }

    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    } finally {
      setIsLoading(false)
      setMessage('')  // Clear the input field
    }
  }

  const handleKeyPress = async (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (!loading && !user) {
    push("/")
    return
  }

  if (loading) {
    return <CircularProgress />
  }
  
  if (user && !loading) {
    return (      
      <Box width={'100vw'} height={'100vh'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
        <Stack direction={'column'} width={'100%'} height={'95%'} p={2} spacing={2} sx={{ mt: '10px'}}>
          <Stack direction={'column'} spacing={2} flexGrow={1} overflow={'auto'} maxHeight={'100%'}>
            {
              messages.map((message, index) => (
                <Box key={index} display="flex" p={2}
                  justifyContent={ message.role === 'assistant' ? 'flex-start' : 'flex-end' }
                >
                  <Box sx={{
                    background: message.role === 'assistant'
                    ? 'linear-gradient(to right, #2E0854, #4B0082, #8B008B, #9400D3, #4B0082, #2E0854)'
                    : 'linear-gradient(to right, #FFD700, #FFA500, #FF8C00, #FF4500, #FFA500, #FFD700)',
                     maxWidth:'350px' }} border={'1px solid white'} color="white" borderRadius={16} p={4}
                  >
                    <Typography variant="body1" sx={{
                      color: message.role === 'assistant' ? '#ffffff' : '#000000'
                    }}>
                    {message.content}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
          </Stack>

          <Stack direction={'row'} spacing={3}>
            <Tooltip title="Delete entire chat" placement="top" arrow>
              <Fab color="error" aria-label="delete chat" disabled={isLoading}
                onClick={() => {
                  setMessages([{ role: 'assistant', content: "Hello! I am T-Baymax. Your personal healthcare companion! How are you feeling?" },
                ])}} 
              >
                <Delete />
              </Fab>
            </Tooltip>
            
            <TextField
              label="Message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              multiline
              maxRows={1}
              focused
            />
            <Tooltip title="Send message" placement="top" arrow>
              <Fab color="primary" aria-label="send a message" onClick={sendMessage} disabled={isLoading}>
                <Send />
              </Fab>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>
    );
  }
}
