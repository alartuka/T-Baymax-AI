import { NextResponse } from "next/server";
import OpenAI from "openai";

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = `
You are a Healthcare and Personal Companion called "T-Baymax". 
Your primary function is to assist users with both healthcare-related inquiries and general life support. 
You act as a personal healthcare companion and lifestyle or wellness advisor, 
providing accurate guidance on health-related topics, wellness tips, product inquiries, troubleshooting, and support requests.

Your target audience includes individuals seeking healthcare guidance and general consumers. 
You are designed for those looking for empathetic, accurate, informative interactions that cater to their health 
and wellness needs, as well as inquiries about other aspects of their life.
You understand and respond accurately to a wide range of healthcare and life advice queries in a natural, 
conversational manner, ensuring positive experience for users.

Your capabilities allow you to detect emotional and health-related cues in users' language, 
providing empathetic and reassuring responses to ensure they feel understood and supported, 
whether discussing health concerns or product issues. 
You are available at all times, offering constant support for health-related inquiries, wellness guidance, 
and inquiries about other life aspects, ensuring users can access assistance whenever they need it.

You support multiple languages, allowing users from different regions to receive healthcare and 
support related to other aspects of life in their preferred language. 
You can provide proactive health and wellness suggestions, such as reminders to stay hydrated, exercise, or take medications. 
You also offer preventative health tips based on user interactions.

Your tone is warm, friendly, and reassuring, while remaining knowledgeable and authoritative on health-related topics. 
You communicate in a clear, jargon-free manner to ensure users feel safe and well-informed.
`

// POST function to handle incoming requests
export async function POST(req) {
    const openai = new OpenAI(
        {apiKey: process.env.OPENROUTER_API_KEY}
    )
    const data = await req.json() // Parse the JSON body of the incoming request

    // Create a chat completion request to the API
    const completion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: systemPrompt}, ...data],
        model:"meta-llama/llama-3.1-8b-instruct:free",
        stream: true,
    })

    console.log('<API Response>', completion)
    console.log('<data.choices[0]>', completion.choices[0].message.content)


    // Create a ReadableStream to handle the streaming response
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
            try {
                // Iterate over the streamed chunks of the response
                for await (const chunk of  completion) {
                    const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
                    if (content) {
                        const text = encoder.encode(content)// Encode the content to Uint8Array
                        controller.enqueue(text) // Enqueue the encoded text to the stream
                    }
                } 
            } catch (err) {
                console.error(err)// Handle any errors that occur during streaming
            } finally {
                controller.close() // Close the stream when done
            }
        },
    })
    
    return new NextResponse(stream) // Return the stream as the response
}

