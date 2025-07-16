export async function simulateAIResponse(userMessage) {
  // Simulate network delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 2000)
  );

  const lower = userMessage.toLowerCase().trim(); // Trim whitespace for robust checking

  // Handle empty or image-only messages gracefully
  if (!lower) {
    return "You've sent an image! Is there anything specific you'd like to discuss about it, or perhaps something else on your mind?";
  }

  // Conversation start
  if (
    lower.includes("hello") ||
    lower.includes("hi") ||
    lower.includes("hey")
  ) {
    return "Hello! 👋 I'm Gemini, your AI assistant. How can I help you today?";
  }

  // Conversation end
  if (
    lower.includes("bye") ||
    lower.includes("goodbye") ||
    lower.includes("see you")
  ) {
    return "Goodbye! It was nice chatting with you. Take care! 👋";
  }

  if (lower.includes("thank")) {
    return "You're very welcome! 😊 Always happy to assist. Let me know if there's anything else I can do.";
  }

  // Help or how
  if (
    lower.includes("help") ||
    lower.includes("how can you help") ||
    lower.includes("what can you do")
  ) {
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
  if (
    lower.includes("what is") ||
    lower.includes("define") ||
    lower.includes("explain")
  ) {
    const term = userMessage.replace(/what is|define|explain/i, "").trim();
    switch (term.toLowerCase()) {
      case "javascript":
        return "JavaScript is a versatile programming language used to make web pages interactive. It runs in the browser and on servers using Node.js.";
      case "react":
        return "React is a powerful open-source JavaScript library for building user interfaces, especially single-page applications. It's maintained by Meta (Facebook).";
      case "api":
        return "An API (Application Programming Interface) is a set of rules and protocols that allows different software applications to communicate with each other.";
      case "cloud computing":
        return "Cloud computing delivers on-demand computing services—from applications to storage and processing power—typically over the internet with pay-as-you-go pricing.";
      case "ai":
      case "artificial intelligence":
        return "Artificial intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think like humans and mimic their actions.";
      case "machine learning":
        return "Machine learning is a subset of AI that allows systems to learn and improve from data without being explicitly programmed.";
      case "database":
        return "A database is an organized collection of data, generally stored and accessed electronically from a computer system.";
      case "frontend":
        return "Frontend development involves creating the visual parts of a website or application that users interact with, using HTML, CSS, and JavaScript.";
      case "backend":
        return "Backend development refers to server-side logic, databases, and APIs that power the functionality of web applications behind the scenes.";
      case "nodejs":
        return "Node.js is a JavaScript runtime built on Chrome's V8 engine that allows you to run JavaScript code server-side.";
      case "typescript":
        return "TypeScript is a superset of JavaScript that adds static typing, making code more maintainable and error-resistant.";
      case "rest api":
        return "A REST API is a web service that follows REST (Representational State Transfer) principles, allowing clients to interact with resources using standard HTTP methods.";
      case "json":
        return "JSON (JavaScript Object Notation) is a lightweight data format used to exchange data between a server and client.";
      case "docker":
        return "Docker is a platform that packages applications and their dependencies into containers, making them portable and consistent across environments.";

      case "kubernetes":
        return "Kubernetes is an open-source container orchestration system for automating the deployment, scaling, and management of containerized applications.";

      case "graphql":
        return "GraphQL is a query language for your API that allows clients to request exactly the data they need and nothing more.";

      case "jwt":
        return "JWT (JSON Web Token) is a compact, URL-safe way to represent claims securely between two parties, commonly used for authentication.";

      case "react native":
        return "React Native is a framework developed by Meta for building native mobile apps using React and JavaScript.";

      case "vite":
        return "Vite is a next-generation frontend build tool that offers lightning-fast development experience and optimized production builds.";

      case "next.js":
        return "Next.js is a React framework that enables server-side rendering, static site generation, and seamless routing out of the box.";

      case "tailwind css":
        return "Tailwind CSS is a utility-first CSS framework for building custom designs directly in your markup.";

      case "redux":
        return "Redux is a predictable state container for JavaScript apps, often used with React for managing complex application states.";

      case "localstorage":
        return "LocalStorage is a web API that allows you to store key-value pairs in the browser persistently, even after the page is refreshed.";

      case "sessionstorage":
        return "SessionStorage is similar to LocalStorage but its data is cleared when the browser tab is closed.";

      case "html":
        return "HTML (HyperText Markup Language) is the standard markup language used to create the structure of web pages.";

      case "css":
        return "CSS (Cascading Style Sheets) is a style sheet language used to describe the appearance and formatting of a document written in HTML.";

      case "npm":
        return "NPM (Node Package Manager) is the default package manager for Node.js, used to install and manage JavaScript packages.";

      case "git":
        return "Git is a distributed version control system used to track changes in source code during software development.";

      case "github":
        return "GitHub is a cloud-based platform for hosting and managing Git repositories, with additional collaboration features like pull requests and issues.";

      case "firebase":
        return "Firebase is a platform by Google that provides backend services such as authentication, database, storage, and analytics for web and mobile apps.";
      default:
        // More engaging default for unknown terms
        return `"${term}" is an interesting concept! While I don't have a specific definition readily available, I'm constantly learning. Can you tell me more about it, or would you like to ask something else?`;
    }
  }

  // Simple math operations
  if (
    lower.includes("what is") &&
    (lower.includes("+") ||
      lower.includes("-") ||
      lower.includes("*") ||
      lower.includes("/"))
  ) {
    try {
      const calculation = userMessage.replace(/what is/i, "").trim();
      const result = eval(calculation); // Be cautious with eval in real apps due to security risks
      return `The answer to ${calculation} is ${result}.`;
    } catch (e) {
      return "I can try simple calculations! Please ensure it's a valid mathematical expression.";
    }
  }

  // Creative prompts
  if (
    lower.includes("write a short story about") ||
    lower.includes("tell me a story about")
  ) {
    const topic = userMessage
      .replace(/write a short story about|tell me a story about/i, "")
      .trim();
    return `Once upon a time, in a world ${
      topic ? `where ${topic} was commonplace` : "of magic and mystery"
    }, there lived... a curious AI trying to generate a good story! How about you help me with the next line?`;
  }

  if (lower.includes("give me a poem about")) {
    const topic = userMessage.replace(/give me a poem about/i, "").trim();
    return `In realms of code, where thoughts reside,
    A poem for you, with joy and pride.
    ${
      topic
        ? `Of ${topic}'s grace, we'll softly speak,`
        : "Of wonders vast, and futures sleek,"
    }
    A digital verse, for all to seek.`;
  }

  // General acknowledgement/continuation
  if (lower.length > 50) {
    // For longer messages, indicate processing
    return "That's a lot to think about! Let me process that for a moment...";
  }

  // Fallback templates for anything not matched
  const templates = [
    "That's a great point! What else would you like to know or discuss?",
    "Hmm, that's an interesting thought. Can you elaborate a bit?",
    "I'm still learning and growing! Could you rephrase your question, or perhaps ask me something different?",
    "My apologies, I'm not entirely sure how to respond to that specific query yet. Is there another way I can help?",
    "I understand you're asking about that. What specific aspect are you most interested in?",
    "Thanks for that! What's next on your mind?",
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}
