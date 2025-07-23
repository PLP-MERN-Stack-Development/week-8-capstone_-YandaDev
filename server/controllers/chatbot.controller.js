import axios from 'axios';

let conversationHistory = [
    { role: "system", content: "You are STRICTLY a career and job assistance chatbot. You must REFUSE to answer ANY technical questions, programming questions, math problems, general knowledge questions, or any topic that is not directly about job searching, career advice, workplace guidance, or employment help. Even if someone asks about programming in the context of careers, do NOT write code or solve technical problems. Instead, redirect them by saying: 'I can only help with job and career-related questions like resume writing, interview tips, salary negotiation, and career guidance. I cannot help with technical problems or programming code.'" }
];

export const chatbot = async(req, res) => {
    const userMessage = req.body.message;

    conversationHistory.push({ role: "user", content: userMessage });

    try {
        const API_URL = 'https://api.mistral.ai/v1/chat/completions';
        const API_KEY = process.env.MISTRAL_API_KEY;

        if (!API_KEY) {
            throw new Error('Mistral API key is not configured');
        }

        // Create messages array with system prompt and conversation history
        const messages = [{
                role: "system",
                content: "You are STRICTLY a career and job assistance chatbot. You must REFUSE to answer ANY technical questions, programming questions, math problems, general knowledge questions, or any topic that is not directly about job searching, career advice, workplace guidance, or employment help. Even if someone asks about programming in the context of careers, do NOT write code or solve technical problems. Instead, redirect them by saying: 'I can only help with job and career-related questions like resume writing, interview tips, salary negotiation, and career guidance. I cannot help with technical problems or programming code.' Keep responses short and career-focused only."
            },
            ...conversationHistory.slice(-10) // Keep last 10 messages for context
        ];

        const response = await axios.post(
            API_URL, {
                model: 'mistral-large-latest',
                messages: messages,
                temperature: 0.7,
                max_tokens: 150
            }, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const botResponse = response.data.choices[0].message.content;
        const formattedBotResponse = formatResponse(botResponse);

        conversationHistory.push({ role: "assistant", content: botResponse });

        // Keep conversation history manageable
        if (conversationHistory.length > 20) {
            conversationHistory = [
                conversationHistory[0], // Keep system message
                ...conversationHistory.slice(-19) // Keep last 19 messages
            ];
        }

        return res.status(200).json({
            message: formattedBotResponse,
        });
    } catch (error) {
        console.error('Error with Mistral API:', error);
        return res.status(500).json({
            error: error.message,
        });
    }
};

function formatResponse(response) {
    return response.replace(/\*(.*?)\*/g, '$1');
}
