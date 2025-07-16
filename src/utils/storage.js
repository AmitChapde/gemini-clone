export const storage = {
  getChatrooms(userId) {
    const key = `gemini-chatrooms_${userId}`;
    return JSON.parse(localStorage.getItem(key) || "[]");
  },

  setChatrooms(userId, chatrooms) {
    const key = `gemini-chatrooms_${userId}`;
    localStorage.setItem(key, JSON.stringify(chatrooms));
  },

  getMessages(userId, chatroomId) {
    const key = `gemini-messages_${userId}_${chatroomId}`;
    return JSON.parse(localStorage.getItem(key) || "[]");
  },

  setMessages(userId, chatroomId, messages) {
    const key = `gemini-messages_${userId}_${chatroomId}`;
    localStorage.setItem(key, JSON.stringify(messages));
  },

  getUserData() {
    return JSON.parse(localStorage.getItem("gemini-user") || "null");
  },

  setUserData(user) {
    localStorage.setItem("gemini-user", JSON.stringify(user));
  },

  clearUserData() {
    localStorage.removeItem("gemini-user");
  },

  clearChatrooms(userId) {
    localStorage.removeItem(`gemini-chatrooms_${userId}`);
  },

  clearMessages(userId, chatroomId) {
    localStorage.removeItem(`gemini-messages_${userId}_${chatroomId}`);
  },
};
