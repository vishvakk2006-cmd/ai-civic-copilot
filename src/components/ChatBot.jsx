import { useState } from "react";

function ChatBot() {

  const [question, setQuestion] = useState("");

  const [answer, setAnswer] = useState("");

  function askAI() {

    if (question === "") return;

    if (question.toLowerCase().includes("pm kisan")) {

      setAnswer(
        "PM-KISAN provides ₹6,000 annually in three installments to eligible farmers."
      );

    } else if (question.toLowerCase().includes("housing")) {

      setAnswer(
        "You may be eligible for PM Awas Yojana if your income and housing status satisfy the eligibility criteria."
      );

    } else {

      setAnswer(
        "AI Copilot is still learning. This feature will be connected to an LLM in the future."
      );

    }

  }

  return (

    <div className="chat-box">

      <h2>🤖 AI Civic Assistant</h2>

      <input
        type="text"
        placeholder="Ask anything about government schemes..."
        value={question}
        onChange={(e)=>setQuestion(e.target.value)}
      />

      <button onClick={askAI}>
        Ask AI
      </button>

      <br /><br />

      <p>{answer}</p>

    </div>

  );

}

export default ChatBot;