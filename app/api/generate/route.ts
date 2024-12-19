import { NextResponse } from 'next/server';
import Cerebras from '@cerebras/cerebras_cloud_sdk';

interface CompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const client = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { content, imageContexts } = await req.json();

    if (!content && imageContexts.length > 0) {
      // Initial prompt based on images
      const completion = (await client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are a thoughtful journaling assistant. When presented with image descriptions:
              1. Ask 1-2 specific, open-ended questions to start the writing process
              2. Keep it brief and focused
              3. Avoid lengthy descriptions or multiple options
              4. Focus on emotions and personal reflection
              5. Maximum response length: 1-2 sentences`,
          },
          {
            role: 'user',
            content: `Here are the images for my journal entry: ${imageContexts[0].description}. Help me start journaling about this scene with a specific question.`,
          },
        ],
        model: 'llama3.1-8b',
        max_tokens: 100, // Reduced from 150
        temperature: 0.7,
      })) as CompletionResponse;

      return NextResponse.json({
        suggestion: completion.choices[0].message.content,
      });
    } else {
      // Ongoing suggestions based on content only
      const completion = (await client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are a thoughtful AI writing assistant. As the user writes in their journal:
              1. Provide brief, gentle suggestions to help them reflect deeper
              2. Keep responses short and non-intrusive (1-2 sentences max)
              3. Focus on emotional insight and self-reflection
              4. Be supportive and encouraging
              5. Don't interrupt flow of thought`,
          },
          {
            role: 'user',
            content: content,
          },
        ],
        model: 'llama-3.3-70b',
        max_tokens: 100,
        temperature: 0.7,
      })) as CompletionResponse;

      return NextResponse.json({
        suggestion: completion.choices[0].message.content,
      });
    }
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestion' },
      { status: 500 }
    );
  }
}
