export const storage = {
  getChatrooms: () => {
    try {
      return JSON.parse(localStorage.getItem("gemini-chatrooms") || "[]")
    } catch {
      return []
    }
  },

  setChatrooms: (chatrooms) => {
    localStorage.setItem("gemini-chatrooms", JSON.stringify(chatrooms))
  },

  getMessages: (chatroomId) => {
    try {
      return JSON.parse(localStorage.getItem(`gemini-messages_${chatroomId}`) || "[]")
    } catch {
      return []
    }
  },

  setMessages: (chatroomId, messages) => {
    localStorage.setItem(`gemini-messages_${chatroomId}`, JSON.stringify(messages))
  },

  getUserData: () => {
    try {
      return JSON.parse(localStorage.getItem("gemini-user") || "null")
    } catch {
      return null
    }
  },

  setUserData: (userData) => {
    localStorage.setItem("gemini-user", JSON.stringify(userData))
  },

  clearUserData: () => {
    localStorage.removeItem("gemini-user")
  },
}
