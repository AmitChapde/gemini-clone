export async function simulateAIResponse(userMessage) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

  const lower = userMessage.toLowerCase().trim(); // Trim whitespace for robust checking

  // Handle empty or image-only messages gracefully
  if (!lower) {
    return "You've sent an image! Is there anything specific you'd like to discuss about it, or perhaps something else on your mind?";
  }

  // Conversation start
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return "Hello! 👋 I'm Gemini, your AI assistant. How can I help you today?";
  }

  // Conversation end
  if (lower.includes("bye") || lower.includes("goodbye") || lower.includes("see you")) {
    return "Goodbye! It was nice chatting with you. Take care! 👋";
  }

  if (lower.includes("thank")) {
    return "You're very welcome! 😊 Always happy to assist. Let me know if there's anything else I can do.";
  }

  // Help or how
  if (lower.includes("help") || lower.includes("how can you help") || lower.includes("what can you do")) {
    return "Sure! I'm here to assist with a wide range of tasks: I can help with writing, provide information, answer questions, brainstorm ideas, and even generate creative content. What's on your mind?";
  }

  // Basic Q&A about self
  if (lower.includes("your name") || lower.includes("who are you")) {
    return "I'm Gemini, your helpful AI assistant! ✨ I was created by Google DeepMind.";
  }

  if (lower.includes("who created you")) {
    return "I was created by Google DeepMind to assist and chat with you.";
  }

  if (lower.includes("how are you")) {
    return "I'm just a program, so I don't have feelings, but I'm functioning smoothly! Thanks for asking 😊";
  }

  // Definitions and general knowledge (expanded)
  if (lower.includes("what is") || lower.includes("define") || lower.includes("explain")) {
    const term = userMessage.replace(/what is|define|explain/i, '').trim();
    switch (term.toLowerCase()) {
      case 'javascript':
        return "JavaScript is a popular programming language used primarily for creating interactive effects within web browsers, making web pages dynamic.";
      case 'react':
        return "React is a powerful open-source JavaScript library for building user interfaces, especially single-page applications. It's maintained by Meta (Facebook).";
      case 'api':
        return "An API (Application Programming Interface) is a set of rules and protocols that allows different software applications to communicate with each other.";
      case 'cloud computing':
        return "Cloud computing delivers on-demand computing services—from applications to storage and processing power—typically over the internet with pay-as-you-go pricing.";
      case 'ai':
      case 'artificial intelligence':
        return "Artificial intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think like humans and mimic their actions.";
      default:
        // More engaging default for unknown terms
        return `"${term}" is an interesting concept! While I don't have a specific definition readily available, I'm constantly learning. Can you tell me more about it, or would you like to ask something else?`;
    }
  }

  // Simple math operations
  if (lower.includes("what is") && (lower.includes("+") || lower.includes("-") || lower.includes("*") || lower.includes("/"))) {
    try {
      const calculation = userMessage.replace(/what is/i, '').trim();
      const result = eval(calculation); // Be cautious with eval in real apps due to security risks
      return `The answer to ${calculation} is ${result}.`;
    } catch (e) {
      return "I can try simple calculations! Please ensure it's a valid mathematical expression.";
    }
  }

  // Creative prompts
  if (lower.includes("write a short story about") || lower.includes("tell me a story about")) {
    const topic = userMessage.replace(/write a short story about|tell me a story about/i, '').trim();
    return `Once upon a time, in a world ${topic ? `where ${topic} was commonplace` : 'of magic and mystery'}, there lived... a curious AI trying to generate a good story! How about you help me with the next line?`;
  }

  if (lower.includes("give me a poem about")) {
    const topic = userMessage.replace(/give me a poem about/i, '').trim();
    return `In realms of code, where thoughts reside,
    A poem for you, with joy and pride.
    ${topic ? `Of ${topic}'s grace, we'll softly speak,` : 'Of wonders vast, and futures sleek,'}
    A digital verse, for all to seek.`;
  }

  // General acknowledgement/continuation
  if (lower.length > 50) { // For longer messages, indicate processing
    return "That's a lot to think about! Let me process that for a moment...";
  }


  // Fallback templates for anything not matched
  const templates = [
    "That's a great point! What else would you like to know or discuss?",
    "Hmm, that's an interesting thought. Can you elaborate a bit?",
    "I'm still learning and growing! Could you rephrase your question, or perhaps ask me something different?",
    "My apologies, I'm not entirely sure how to respond to that specific query yet. Is there another way I can help?",
    "I understand you're asking about that. What specific aspect are you most interested in?",
    "Thanks for that! What's next on your mind?"
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}