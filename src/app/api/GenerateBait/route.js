// src/app/api/generateBait/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request) {
    try {
        const { fishName } = await request.json();

        if (!fishName) {
            return NextResponse.json(
                { error: 'Missing fish name' },
                { status: 400 }
            );
        }

        // Configure the OpenAI client
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Construct the messages for the Chat Completion API
        const messages = [
            {
                role: 'system',
                content: 'You are an expert angler providing concise bait recommendations.',
            },
            {
                role: 'user',
                content: `Provide a concise bait recommendation for catching ${fishName}. The recommendation should be as short as possible while still providing useful information. Only list the top 3 bait options, don't say anything besides the numbered list.`,
            },
        ];

        // Make the API call to OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
            temperature: 0.5,
        });

        const baitRecommendation = completion.choices[0].message.content.trim();

        // Send the bait recommendation back to the client
        return NextResponse.json({ bait: baitRecommendation }, { status: 200 });
    } catch (error) {
        console.error('Error fetching bait recommendation from OpenAI:', error);
        return NextResponse.json(
            { error: 'Failed to generate bait recommendation', details: error.message },
            { status: 500 }
        );
    }
}