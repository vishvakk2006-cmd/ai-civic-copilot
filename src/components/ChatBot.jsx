import { useState } from "react";
import { askAssistant } from "../services/api";

function ChatBot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function askAI() {
    const prompt = question.trim();
    if (!prompt || isLoading) return;

    setError("");
    setAnswer("");
    setIsLoading(true);
    try {
      const result = await askAssistant(prompt);
      setAnswer(result.answer);
    } catch (requestError) {
      setError(requestError.message || "The AI assistant is unavailable.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="chat-box">
      <h2>🤖 AI Civic Assistant</h2>
      <input
        type="text"
        placeholder="Ask about government schemes..."
        value={question}
        maxLength={2000}
        onChange={(event) => setQuestion(event.target.value)}
      />
      <button onClick={askAI} disabled={isLoading || !question.trim()}>
        {isLoading ? "Asking..." : "Ask AI"}
      </button>
      {error && <p role="alert">{error}</p>}
      {answer && <p role="status">{answer}</p>}
    </div>
  );
}

export default ChatBot;
