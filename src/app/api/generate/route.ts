import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const command = new InvokeModelCommand({
      modelId:
        process.env.NAVIGATOR_BEDROCK_MODEL_ID ||
        "anthropic.claude-3-5-haiku-20241022-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 200,
        temperature: 0.7,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const response = await client.send(command);
    const data = JSON.parse(new TextDecoder().decode(response.body));
    
    return NextResponse.json({ 
      text: data.content[0].text.trim() 
    });
  } catch (error) {
    console.error("Bedrock error:", error);
    return NextResponse.json(
      { error: 'Unable to generate text right now.' },
      { status: 500 }
    );
  }
}