// app/api/generateRecipe/route.js

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request) {
    try {
        const { recipeName } = await request.json();

        if (!recipeName) {
            return NextResponse.json(
                { error: 'Missing recipe name' },
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
                content: 'You are a master chef providing concise recipes.',
            },
            {
                role: 'user',
                content: `Provide a concise recipe for ${recipeName}. The recipe should be as short as possible while still providing all necessary information to make the dish. Only list the steps, don't say anything besides in the numbered steps.`,
            },
        ];

        // Make the API call to OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
            temperature: 0.5,
        });

        const recipeText = completion.choices[0].message.content.trim();

        // Send the recipe back to the client
        return NextResponse.json({ recipe: recipeText }, { status: 200 });
    } catch (error) {
        console.error('Error fetching recipe from OpenAI:', error);
        return NextResponse.json(
            { error: 'Failed to generate recipe', details: error.message },
            { status: 500 }
        );
    }
}
