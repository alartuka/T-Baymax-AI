import { NextResponse } from "next/server";
import dotenv from 'dotenv';
import OpenAI from "openai";
dotenv.config();


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

// const { GoogleGenerativeAI } = require("@google/generative-ai");

// let genAI;
// if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
//   genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
// } else {
//     throw new Error("Please provide API KEY env variable!")
// }

// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash",   systemInstruction: systemPrompt})


const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
});

export async function POST(req) { 
    
    try {
        const data = await req.json()
        // Validate that data is an array and has at least one element
        if (!Array.isArray(data)) {
            throw new Error("Invalid input: data should be an array of messages.");
        }
        if (!(data.length > 0)) {
            throw new Error("Invalid input: data should not be empty");
        }

        // Create a chat completion request to the OpenAI API
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: systemPrompt }, ...data], // Include the system prompt and user messages
            model: 'meta-llama/llama-3.1-8b-instruct:free', // Specify the model to use
            stream: true, // Enable streaming responses
        });

        // Create a ReadableStream to handle the streaming response
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder(); // Create a TextEncoder to convert strings to Uint8Array
                try {
                    // Iterate over the streamed chunks of the response
                    for await (const chunk of completion) {
                        const content = chunk.choices[0]?.delta?.content; // Extract the content from the chunk
                        if (content) {
                            const text = encoder.encode(content); // Encode the content to Uint8Array
                            controller.enqueue(text); // Enqueue the encoded text to the stream
                        }
                    }
                } catch (err) {
                    controller.error(err); // Handle any errors that occur during streaming
                } finally {
                    controller.close(); // Close the stream when done
                    console.log("<STREAM>", stream);
                }
            },
        });
  
        return new NextResponse(stream); // Return the stream as the response

    } catch (error) {
        console.error("<Error in POST /api/chat>", error); // Log the error for debugging
        return NextResponse.json({ error: error.message }, { status: 400 }); // Return a 400 Bad Request response with the error message
    }
}

// const prompt = messages[messages.length - 1].content;

//         // Assuming model.generateContent() expects a string prompt
//         const result = await model.generateContent(prompt);

//         // Send back the generated content
//         return new NextResponse(result.response.text(), { status: 200 });

//     } catch (err) {
//         console.error("Error processing request:", err);
//         return new NextResponse("Internal Server Error", { status: 500 });
//     }