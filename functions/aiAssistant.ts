import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { action, text, userHistory, context } = await req.json();

        let prompt = "";
        let jsonSchema = null;

        if (action === "summarize") {
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