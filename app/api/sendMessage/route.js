import OpenAI from "openai/index.mjs";
import { NextResponse } from "next/server";
import { systemPrompt } from "./systemPrompt";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
});

export async function POST(req) {
    
    const { message } = await req.json(); 
    console.log("Received message: ", message);
    try {
        const completion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          model: "openai/gpt-4o-mini",
          max_tokens: 500,
        });
    
        const response = completion.choices[0].message.content;
    
        if (!response) {
          throw new Error("No content received from OpenAI");
        }
        return NextResponse.json({ reply: response }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}
