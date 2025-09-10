export async function generateText(prompt: string): Promise<string> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      return data.error;
    }
    
    return data.text;
  } catch (error) {
    console.error("Bedrock error:", error);
    return "Unable to generate text right now.";
  }
}
