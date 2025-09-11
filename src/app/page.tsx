"use client";

import { useState } from "react";
import NavigatorWidget from "../components/NavigatorWidget";
import { generateText } from "../services/bedrock";

export default function Home() {
  const [generatedText, setGeneratedText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickGenerate = async () => {
    setIsLoading(true);
    try {
      const text = await generateText(
        "Write a helpful tip for compliance onboarding"
      );
      setGeneratedText(text);
    } catch (_) {
      setGeneratedText("Error generating text");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomGenerate = async () => {
    if (!userInput.trim()) {
      setGeneratedText("Please enter a prompt first");
      return;
    }

    setIsLoading(true);
    try {
      const text = await generateText(userInput);
      setGeneratedText(text);
    } catch (_) {
      setGeneratedText("Error generating text");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex gap-4">
        <div className="w-full max-w-sm">
          <NavigatorWidget />
        </div>

        {/* Bedrock Test Panel */}
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6" data-test="bedrock-test-panel">
          <h2 className="text-lg font-semibold text-black mb-4">🤖 Ask anything to Bedrock</h2>

          {/* Quick Generate Button */}
          <button
            onClick={handleQuickGenerate}
            disabled={isLoading}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {isLoading ? "Generating..." : "Quick Generate (Compliance Tip)"}
          </button>

          {/* Custom Input Section */}
          <div className="mb-4">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter your custom prompt here..."
              className="w-full p-3 border border-gray-300 rounded-md resize-none"
              rows={3}
            />
          </div>

          <button
            onClick={handleCustomGenerate}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {isLoading ? "Generating..." : "Generate from Custom Input"}
          </button>

          {/* Result Display */}
          {generatedText && (
            <div className="bg-gray-50 rounded-md p-4 border">
              <p className="text-sm text-gray-700">{generatedText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
