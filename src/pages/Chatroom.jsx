import { useState, useEffect, useRef, useCallback } from "react"
import { storage } from "../utils/storage"
import { simulateAIResponse } from "../utils/mockData"
import { MessageSkeleton } from "../components/loadingSkeleton"
import { generateChatroomTitle } from "../utils/title-generator"
import toast from "react-hot-toast"

export function Chatroom({ userId, chatroomId, chatroomTitle, onBack, onTitleUpdate, isMobile }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [titleGenerated, setTitleGenerated] = useState(false)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const loadMessages = () => {
      setIsLoading(true)
      setTimeout(() => {
        const saved = storage.getMessages(userId, chatroomId) || []
        const initMsg = {
          id: `msg_${Date.now()}_1`,
          content: "Hello! I'm Gemini, a helpful AI assistant created by Google. How can I help you today?",
          sender: "ai",
          timestamp: Date.now(),
          type: "text",
        }
        if (saved.length === 0) {
          setMessages([initMsg])
          storage.setMessages(userId, chatroomId, [initMsg])
        } else {
          setMessages(saved)
          const userMessages = saved.filter((msg) => msg.sender === "user")
          setTitleGenerated(chatroomTitle !== "New conversation")
        }
        setIsLoading(false)
      }, 500)
    }

    loadMessages()
  }, [userId, chatroomId, chatroomTitle])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [newMessage])

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file && file.size < 5 * 1024 * 1024) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target?.result)
      reader.readAsDataURL(file)
    } else {
      toast.error("Image must be under 5MB")
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedImage) return

    const msg = {
      id: `msg_${Date.now()}`,
      content: newMessage.trim(),
      sender: "user",
      timestamp: Date.now(),
      type: selectedImage ? "image" : "text",
      imageUrl: imagePreview || undefined,
    }

    const updated = [...messages, msg]
    setMessages(updated)
    storage.setMessages(userId, chatroomId, updated)

    // Generate title from first user message
    if (!titleGenerated && msg.sender === "user" && msg.content.trim()) {
      const newTitle = generateChatroomTitle(msg.content)
      onTitleUpdate(chatroomId, newTitle)
      setTitleGenerated(true)
    }

    setNewMessage("")
    removeImage()
    setIsTyping(true)

    try {
      const aiReply = await simulateAIResponse(msg.content)
      const aiMsg = {
        id: `msg_${Date.now()}_ai`,
        content: aiReply,
        sender: "ai",
        timestamp: Date.now(),
        type: "text",
      }
      const final = [...updated, aiMsg]
      setMessages(final)
      storage.setMessages(userId, chatroomId, final)
    } catch {
      toast.error("AI response failed")
    } finally {
      setIsTyping(false)
    }
  }

  const copyMessage = async (content) => {
    try {
      await navigator.clipboard.writeText(content)
      toast.success("Copied to clipboard")
    } catch {
      toast.error("Failed to copy")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const visible = messages.filter((m) => !searchQuery || m.content.toLowerCase().includes(searchQuery.toLowerCase()))

  const renderMessage = (message) => (
    <div key={message.id} className="group">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          {message.sender === "ai" ? (
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {message.sender === "ai" ? "Gemini" : "You"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
          {message.type === "image" && (
            <img
              src={message.imageUrl || "/placeholder.svg"}
              alt="User Upload"
              className="max-w-sm rounded-lg border border-gray-300 dark:border-gray-700 mb-2"
            />
          )}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{message.content}</p>
          </div>
          <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => copyMessage(message.content)}
              title="Copy"
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
            >
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-[#1A1A1A] overflow-hidden">
        <MessageSkeleton />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1A1A1A] overflow-hidden">
      {/* Header - Only show back button and title on mobile when in chatroom */}
      {isMobile && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0 bg-white dark:bg-[#1A1A1A]">
          <button onClick={onBack} className="text-gray-900 dark:text-white">
            ←
          </button>
          <h2 className="text-gray-900 dark:text-white font-medium truncate">{chatroomTitle}</h2>
          <div className="w-6" />
        </div>
      )}

      {/* Search - Hide on mobile to save space */}
      {!isMobile && (
        <div className="px-4 mt-2 flex-shrink-0">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 dark:bg-[#2A2A2A] text-gray-900 dark:text-white p-2 rounded text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 min-h-0">
        <div className="space-y-8">
          {visible.map(renderMessage)}
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        {imagePreview && (
          <div className="mb-2">
            <img
              src={imagePreview || "/placeholder.svg"}
              alt="Preview"
              className="max-h-40 rounded border border-gray-300 dark:border-gray-600"
            />
            <button onClick={removeImage} className="text-sm text-red-400 mt-1">
              Remove
            </button>
          </div>
        )}
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              rows={1}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Gemini"
              className="w-full resize-none bg-gray-100 dark:bg-[#2A2A2A] text-gray-900 dark:text-white p-3 pr-12 rounded-full text-sm max-h-32 overflow-y-auto border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() && !selectedImage}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-full transition-colors flex-shrink-0"
          >
            {newMessage.trim() || selectedImage ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
