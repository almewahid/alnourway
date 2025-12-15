import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const reqPayload = await req.json();
        const { action, text, userHistory, context } = reqPayload;

        let prompt = "";
        let jsonSchema = null;

        if (action === "chat") {
             // General chat
             prompt = reqPayload.prompt || `You are an Islamic assistant. Answer the user: ${text}`;
             // No jsonSchema for chat, returns string
        } else if (action === "summarize") {
            prompt = `Summarize the following Islamic text into 3-5 concise bullet points in Arabic. Text: ${text}`;
            jsonSchema = {
                type: "object",
                properties: {
                    summary: { type: "string" }
                }
            };
        } else if (action === "refine_question") {
            prompt = `Rewrite the following question to be more clear, precise, and polite in Arabic, suitable for asking an Islamic scholar. Original Question: ${text}`;
            jsonSchema = {
                type: "object",
                properties: {
                    refined_text: { type: "string" }
                }
            };
        } else if (action === "recommend") {
            prompt = `Based on the user's history: ${JSON.stringify(userHistory)}, suggest 3 specific topics or books in Arabic that they might be interested in. Focus on Islamic education.`;
            jsonSchema = {
                type: "object",
                properties: {
                    recommendations: { 
                        type: "array", 
                        items: { 
                            type: "object", 
                            properties: {
                                title: { type: "string" },
                                reason: { type: "string" }
                            }
                        } 
                    }
                }
            };
        } else if (action === "generate_learning_path") {
            prompt = `Create a personalized Islamic learning path for a user with the following profile: ${JSON.stringify(context)}. 
            The path should consist of 3 concise ordered steps (modules). 
            For each step, include a simple quiz question with 3 options and the correct answer to test understanding.
            Language: Arabic.`;
            jsonSchema = {
                type: "object",
                properties: {
                    steps: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                title: { type: "string" },
                                description: { type: "string" },
                                duration: { type: "string" },
                                resources: { type: "array", items: { type: "string" } },
                                quiz: {
                                    type: "object",
                                    properties: {
                                        question: { type: "string" },
                                        options: { type: "array", items: { type: "string" } },
                                        correct_answer: { type: "string" }
                                    }
                                }
                            }
                        }
                    }
                }
            };
        } else if (action === "fatwa_assist") {
             prompt = `You are an expert Islamic Fatwa Assistant. The user asks: "${text}". 
             Provide a preliminary answer based on standard Islamic jurisprudence (Sunni). 
             Cite sources if possible. State clearly that this is AI-generated and they should consult a real scholar for final rulings. 
             Language: Arabic.`;
             // Returns string text
        } else if (action === "translate_content") {
             const targetLang = context.targetLang || 'en';
             prompt = `Translate the following text to ${targetLang}: "${text}". Return only the translated text.`;
             jsonSchema = {
                 type: "object",
                 properties: {
                     translated_text: { type: "string" }
                 }
             };
        } else if (action === "generate_lecture") {
            prompt = `Generate a detailed Islamic lecture outline and content about: "${text}". 
            Include a catchy title, a suggested speaker name (e.g., 'Sheikh Ahmed'), a detailed description, the main topic, and estimated duration. 
            Language: Arabic.`;
            jsonSchema = {
                type: "object",
                properties: {
                    title: { type: "string" },
                    speaker: { type: "string" },
                    description: { type: "string" },
                    topic: { type: "string" },
                    duration: { type: "string" }
                }
            };
        } else if (action === "generate_story") {
            prompt = `Write a short inspiring Islamic story based on the theme or event: "${text}". 
            Include a title, author (or 'Unknown'), the full content of the story, a short excerpt, and a category (either 'convert' or 'repentance'). 
            Language: Arabic.`;
            jsonSchema = {
                type: "object",
                properties: {
                    title: { type: "string" },
                    author: { type: "string" },
                    content: { type: "string" },
                    excerpt: { type: "string" },
                    category: { type: "string", enum: ["convert", "repentance"] }
                }
            };
        } else if (action === "generate_fatwa_answer") {
            prompt = `Draft a comprehensive initial answer for the following Islamic question: "${text}". 
            Include the answer text, a suggested mufti name, a relevant category (e.g., 'ibadat', 'muamalat'), and a reference (Quran/Hadith or Fiqh book). 
            Language: Arabic.`;
            jsonSchema = {
                type: "object",
                properties: {
                    answer: { type: "string" },
                    mufti: { type: "string" },
                    category: { type: "string" },
                    reference: { type: "string" }
                }
            };
        } else if (action === "generate_article") {
            prompt = `Write a comprehensive Islamic article about: "${text}". 
            Include a captivating title, the full article content (structured with paragraphs), suggested tags, and a meta description for SEO. 
            Language: Arabic.`;
            jsonSchema = {
                type: "object",
                properties: {
                    title: { type: "string" },
                    content: { type: "string" },
                    tags: { type: "array", items: { type: "string" } },
                    meta_description: { type: "string" }
                }
            };
        } else if (action === "suggest_titles") {
            prompt = `Suggest 5 catchy and SEO-friendly titles for an article about: "${text}". Language: Arabic.`;
            jsonSchema = {
                type: "object",
                properties: {
                    titles: { type: "array", items: { type: "string" } }
                }
            };
        } else if (action === "generate_meta_description") {
            prompt = `Generate a concise and engaging SEO meta description (under 160 characters) for an article about: "${text}". Language: Arabic.`;
            jsonSchema = {
                type: "object",
                properties: {
                    meta_description: { type: "string" }
                }
            };
        } else {
            return Response.json({ error: "Invalid action" }, { status: 400 });
        }

        const result = await base44.integrations.Core.InvokeLLM({
            prompt: prompt,
            response_json_schema: jsonSchema
        });

        return Response.json(result);

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});