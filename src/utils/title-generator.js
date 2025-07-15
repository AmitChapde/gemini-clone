export function generateChatroomTitle(firstMessage) {
  if (!firstMessage || firstMessage.length < 3) {
    return "New conversation"
  }

  // Remove common question words and clean the message
  const cleanMessage = firstMessage
    .replace(
      /^(how|what|when|where|why|who|can|could|would|should|will|do|does|did|is|are|was|were|have|has|had)\s+/i,
      "",
    )
    .replace(/[?!.]+$/, "")
    .trim()

  // Take first 4-6 words or up to 40 characters
  const words = cleanMessage.split(" ")
  let title = words.slice(0, Math.min(6, words.length)).join(" ")

  if (title.length > 40) {
    title = title.substring(0, 37) + "..."
  }

  // Capitalize first letter
  title = title.charAt(0).toUpperCase() + title.slice(1)

  return title || "New conversation"
}
