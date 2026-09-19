const GENERIC_REPLIES: { text: string; suggestions?: string[] }[] = [
  {
    text: "Good question — let's break that down together. What specific part would you like to focus on first?",
  },
  {
    text: "That's a strong angle. I'd lead with a concrete example, then connect it back to why this program matters to you.",
  },
  {
    text: "Here's a tip: scholarship reviewers skim quickly, so keep your strongest point in the first sentence of each paragraph.",
  },
];

/** Stands in for a real assistant call — picks a canned reply based on
 * simple keyword matching, with a generic fallback. */
export function buildAssistantReply(message: string): {
  text: string;
  suggestions?: string[];
} {
  const lower = message.toLowerCase();

  if (lower.includes("introduction") || lower.includes("passion")) {
    return {
      text: "Great choice. Open with a specific moment that sparked your passion for this field — a story is more memorable than a general statement.",
    };
  }

  if (lower.includes("volunteer") || lower.includes("experience")) {
    return {
      text: "For your volunteer experience, name the organization, your role, and one measurable outcome — hours contributed, people reached, or a project completed.",
    };
  }

  if (lower.includes("goal") || lower.includes("future")) {
    return {
      text: "For future goals, connect your plans directly to what this scholarship enables — be specific about the next 2-3 years.",
    };
  }

  return GENERIC_REPLIES[Math.floor(Math.random() * GENERIC_REPLIES.length)];
}

export function formatMessageTime(date: Date = new Date()): string {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
