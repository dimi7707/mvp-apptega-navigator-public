# Adding AWS Bedrock LLM Integration to Apptega Navigator

Simple, step-by-step guide to get AWS Bedrock working in your Navigator widget. Start basic, then iterate!

## Quick Start (3 Steps)

1. [Install Dependencies](#step-1-install-dependencies)
2. [Add Environment Variables](#step-2-environment-setup)
3. [Create Basic Service](#step-3-basic-bedrock-service)

## Prerequisites

- AWS Bedrock configured ✅
- AWS API credentials ready ✅

## Step 1: Install Dependencies

```bash
npm install @aws-sdk/client-bedrock-runtime
```

## Step 2: Environment Setup

Create `.env.local`:

```bash
NAVIGATOR_AWS_REGION=us-east-1
NAVIGATOR_AWS_ACCESS_KEY_ID=your_key_here
NAVIGATOR_AWS_SECRET_ACCESS_KEY=your_secret_here
NAVIGATOR_BEDROCK_MODEL_ID=amazon.titan-text-express-v1
```

## Step 3: Basic Bedrock Service

Create `src/services/bedrock.ts`:

```typescript
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.NAVIGATOR_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.NAVIGATOR_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NAVIGATOR_AWS_SECRET_ACCESS_KEY!,
  },
});

export async function generateText(prompt: string): Promise<string> {
  try {
    const command = new InvokeModelCommand({
      modelId: process.env.NAVIGATOR_BEDROCK_MODEL_ID || "amazon.titan-text-express-v1",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inputText: prompt,
        textGenerationConfig: {
          maxTokenCount: 200,
          temperature: 0.7,
        },
      }),
    });

    const response = await client.send(command);
    const data = JSON.parse(new TextDecoder().decode(response.body));
    return data.results[0].outputText.trim();
  } catch (error) {
    console.error("Bedrock error:", error);
    return "Unable to generate text right now.";
  }
}
```

## Test It Out

Add this to any component to test (with dual functionality):

```typescript
import { generateText } from "@/services/bedrock";

// In your component
const [generatedText, setGeneratedText] = useState("");
const [userInput, setUserInput] = useState("");
const [isLoading, setIsLoading] = useState(false);

// Pre-defined prompt generator
const handleQuickGenerate = async () => {
  setIsLoading(true);
  try {
    const text = await generateText(
      "Write a helpful tip for compliance onboarding"
    );
    setGeneratedText(text);
  } catch (error) {
    setGeneratedText("Error generating text");
  } finally {
    setIsLoading(false);
  }
};

// Custom user input generator
const handleCustomGenerate = async () => {
  if (!userInput.trim()) {
    setGeneratedText("Please enter a prompt first");
    return;
  }

  setIsLoading(true);
  try {
    const text = await generateText(userInput);
    setGeneratedText(text);
  } catch (error) {
    setGeneratedText("Error generating text");
  } finally {
    setIsLoading(false);
  }
};

return (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-lg font-semibold mb-4">🤖 Bedrock LLM Test</h2>

    {/* Quick Generate Button */}
    <button
      onClick={handleQuickGenerate}
      disabled={isLoading}
      className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 mb-4"
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
      className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 mb-4"
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
);
```

That's it! You now have basic Bedrock integration. Once this works, we can iterate and add more features.

## Next Steps (Once Basic Version Works)

1. **Add to Navigator Widget**: Integrate `generateText()` into your step descriptions
2. **Add Error Handling**: Improve error messages and fallbacks
3. **Add Caching**: Store responses to avoid repeated API calls
4. **Customize Prompts**: Make prompts specific to your compliance domain

## Quick Troubleshooting

- **"Access Denied"**: Check your AWS credentials with NAVIGATOR_ prefix in `.env.local`
- **"Model Not Found"**: Verify model ID matches what's enabled in your AWS account
- **Empty Response**: Check AWS region matches your Bedrock setup

That's it! Start with this basic version, test it works, then we can add more features step by step.
