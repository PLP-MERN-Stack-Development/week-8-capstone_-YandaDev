import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { FaComments, FaCircle } from "react-icons/fa";
import { toast } from "sonner";
import { Send, X } from "lucide-react";
import axios from "axios";
import './ChatBot.css';

// Mistral AI API integration
const API_URL = "https://api.mistral.ai/v1/chat/completions";
const TECH_JOB_HUB_SYSTEM_PROMPT = `You are TechJobHub AI, created by TechJobHub Technologies in South Africa. 
You help job seekers and recruiters connect. IMPORTANT: Keep all responses extremely brief (1-2 short sentences max).
Never use bullet points or lists. Never write more than 150 characters in a response.
Only respond to questions related to jobs, careers, hiring, resumes, or interviews.
If a question is not clearly about a job or career, reply with: "Sorry, I can only help with job and career-related questions." Do not attempt to answer anything else.`;
const ChatBot = () => {
    const [chatBotOpen, setChatBotOpen] = useState(false);
    const [conversationHistory, setConversationHistory] = useState([
        { role: "system", content: TECH_JOB_HUB_SYSTEM_PROMPT }
    ]);
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi there! How can I help you today?" },
        { sender: "bot", text: "I can answer questions about jobs and career growth." },
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([
        "Job Opportunities",
        "Application Tips",
        "Interview Prep",
        "Resume Help",
        "Salary Advice",
        "Career Growth",
    ]);

    const messagesEndRef = useRef(null);
    const API_KEY = import.meta.env.VITE_MISTRAL_API_KEY;

    const generateMistralResponse = async (userInput) => {
        try {
            // Add user message to conversation history
            const updatedHistory = [
                ...conversationHistory,
                { role: "user", content: userInput }
            ];

            const response = await axios.post(
                API_URL,
                {
                    model: "mistral-tiny",
                    messages: updatedHistory,
                    temperature: 0.7,
                    max_tokens: 100, // Reduced max tokens for shorter responses
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${API_KEY}`,
                    },
                    timeout: 15000,
                }
            );

            const aiResponse = response.data.choices[0].message.content;

            // Update conversation history with AI response
            setConversationHistory([
                ...updatedHistory,
                { role: "assistant", content: aiResponse }
            ]);

            return aiResponse;
        } catch (error) {
            console.error("Error:", error);
            return "Sorry, I couldn't process that. Please try again.";
        }
    };

    const handleSendMessage = async (message) => {
        if (!message.trim()) return;

        setMessages((prev) => [...prev, { sender: "user", text: message }]);
        setNewMessage("");
        setLoading(true);

        try {
            const botResponse = await generateMistralResponse(message);
            simulateTypingEffect(botResponse);
        } catch (error) {
            toast.error("Connection error");
            setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, I couldn't connect. Try again later." }]);
            setLoading(false);
        }
    };

    const simulateTypingEffect = (fullMessage) => {
        const words = fullMessage.split(" ");
        let currentMessage = "";
        let index = 0;

        setMessages((prev) => [...prev, { sender: "bot", text: "..." }]);

        const typingInterval = setInterval(() => {
            if (index < words.length) {
                currentMessage += (index > 0 ? " " : "") + words[index];
                index++;

                setMessages((prev) =>
                    prev.map((msg, idx) =>
                        idx === prev.length - 1
                            ? { sender: "bot", text: currentMessage }
                            : msg
                    )
                );
            } else {
                clearInterval(typingInterval);
                setLoading(false);
            }
        }, 50); // Even faster typing for short messages
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Check if categories should be shown
    const shouldShowCategories = messages.length === 2 && messages[0].sender === "bot" && messages[1].sender === "bot";

    return (
        <div className="fixed bottom-4 right-4 z-50">
            { chatBotOpen ? (
                <Card className="w-72 max-w-xs p-3 flex flex-col space-y-3 shadow-lg bg-gradient-to-br from-[#00040A] to-[#001636] border border-blue-600 rounded-lg">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <h2 className="font-bold text-sm text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                                TechJobHub AI
                            </h2>
                            <FaCircle className="text-green-500 text-xs" />
                        </div>
                        <Button
                            variant="ghost"
                            onClick={ () => setChatBotOpen(false) }
                            className="text-blue-500 hover:text-white hover:bg-gray-500 p-1 h-8 w-8"
                        >
                            <X size={ 16 } />
                        </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-md p-2 max-h-56">
                        { messages.map((message, index) => (
                            <div
                                key={ index }
                                className={ `flex ${message.sender === "user" ? "justify-end" : "justify-start"}` }
                            >
                                <div
                                    className={ `p-2 rounded-lg max-w-full text-sm ${message.sender === "user"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-700 text-white"
                                        }` }
                                >
                                    { message.text }
                                </div>
                            </div>
                        )) }
                        { loading && (
                            <div className="flex justify-start ml-1">
                                <div className="loader"></div>
                            </div>
                        ) }
                        <div ref={ messagesEndRef } />
                    </div>
                    { shouldShowCategories && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            { categories.map((category, idx) => (
                                <Button
                                    key={ idx }
                                    className="bg-blue-400 hover:bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs"
                                    onClick={ () => handleSendMessage(category) }
                                >
                                    { category }
                                </Button>
                            )) }
                        </div>
                    ) }
                    <div className="flex items-center space-x-1 mt-2">
                        <Input
                            placeholder="Type a message..."
                            value={ newMessage }
                            onChange={ (e) => setNewMessage(e.target.value) }
                            onKeyPress={ (e) => {
                                if (e.key === 'Enter') {
                                    handleSendMessage(newMessage);
                                }
                            } }
                            className="flex-1 border-blue-300 bg-transparent text-white text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 h-8"
                        />
                        <Button
                            onClick={ () => handleSendMessage(newMessage) }
                            className="bg-blue-500 hover:bg-blue-600 text-white h-8 w-8 p-1"
                            disabled={ loading }
                        >
                            <Send size={ 16 } />
                        </Button>
                    </div>
                </Card>
            ) : (
                <Button
                    onClick={ () => setChatBotOpen(true) }
                    className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-2 rounded-full shadow-md hover:bg-blue-600 bounce"
                >
                    <FaComments className="text-lg" />
                    <span className="text-sm">ASK ME</span>
                </Button>
            ) }
        </div>
    );
};

export default ChatBot;
