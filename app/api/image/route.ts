import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

interface ImageData {
  data: string;
  mediaType: string;
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { images } = await req.json();

    // Format images for Claude API
    const formattedImages = images.map((img: ImageData) => ({
      type: 'image',
      source: {
        type: 'base64',
        media_type: img.mediaType,
        // Remove data URL prefix if present
        data: img.data.replace(/^data:image\/[a-z]+;base64,/, ''),
      },
    }));

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            ...formattedImages,
            {
              type: 'text',
              text: 'Describe what you see in these images in a single paragraph. Focus on the visual elements, emotions, and atmosphere. Do not make assumptions or add interpretations.',
            },
          ],
        },
      ],
    });

    return NextResponse.json({
      description:
        message.content[0].type === 'text' ? message.content[0].text : '',
    });
  } catch (error) {
    console.error('Image processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process images' },
      { status: 500 }
    );
  }
}
