import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosclient";
import { Send } from 'lucide-react';

function ChatAi({problem}) {
    const [messages, setMessages] = useState([
        { role: 'model', parts:[{text:"Hi, How are you" }]},
        { role: 'user', parts:[{text:  "I am Good"}] }
    ]);

    const { register, handleSubmit, reset,formState: {errors} } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async (data) => {
        setMessages(prev => [...prev, { role: 'user', parts: [ {text : data.message  }]}]);
        reset();

        try {
            const response = await axiosClient.post("/ai/chat", {
                messages:messages,
                title:problem.title,
                description:problem.description,
                testCases:problem.visibletestcases,
                startCode:problem.startCode
            });

            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: response.data.message}]
            }]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{ text: "Sorry, I encountered an error" }]
            }]);
        }
    };

    return (
        <div className="flex flex-col h-[80vh] max-h-[80vh] min-h-[500px] bg-base-200 rounded-xl shadow border border-base-300">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`chat-bubble px-4 py-2 rounded-2xl max-w-xs break-words ${
                                msg.role === "user"
                                    ? "bg-primary text-primary-content"
                                    : "bg-base-100 text-base-content border border-base-300"
                            }`}
                        >
                            {msg.parts[0].text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="sticky bottom-0 p-4 bg-base-100 border-t flex items-center gap-2 shadow-inner"
                style={{ zIndex: 10 }}
            >
                <input 
                    placeholder="Ask me anything" 
                    className="input input-bordered flex-1" 
                    {...register("message", { required: true, minLength: 2 })}
                />
                <button 
                    type="submit" 
                    className="btn btn-primary btn-circle"
                    disabled={errors.message}
                    title="Send"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
}

export default ChatAi;