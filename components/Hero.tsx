
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const initialTagline = "Build, Deploy, and Scale with Aenzbi";
const personas = ["a startup founder", "an enterprise developer", "a freelance developer", "a student learning to code"];

const Hero: React.FC = () => {
    const [tagline, setTagline] = useState(initialTagline);
    const [isLoading, setIsLoading] = useState(false);

    const handlePersonalize = async () => {
        setIsLoading(true);
        try {
            if (!process.env.API_KEY) {
                throw new Error("API key not configured.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const randomPersona = personas[Math.floor(Math.random() * personas.length)];
            const prompt = `Generate a short, catchy, and professional tagline for a complete developer platform called Aenzbi. The tagline should be under 10 words and appeal to ${randomPersona}. Do not use quotes.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setTagline(response.text.replace(/["*]/g, '').trim());

        } catch (error) {
            console.error("Failed to generate tagline:", error);
            setTagline("The Ultimate Toolkit for Modern Developers"); // Fallback
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="bg-black text-white py-20 sm:py-24 lg:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                    Complete Developer Platform
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-brand-blue h-8">
                    {isLoading ? "Generating..." : tagline}
                </p>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
                    Your comprehensive tech platform for software development, training, hosting, and cloud deployment. Everything developers need in one powerful ecosystem.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="#" className="w-full sm:w-auto inline-block bg-brand-blue text-white font-semibold rounded-lg px-8 py-3 text-center transition duration-300 ease-in-out hover:bg-blue-700">
                        Start Building
                    </a>
                    <button onClick={handlePersonalize} disabled={isLoading} className="w-full sm:w-auto inline-block bg-gray-800 text-white font-semibold rounded-lg px-8 py-3 text-center transition duration-300 ease-in-out hover:bg-gray-700 border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? "Personalizing..." : "Personalize"}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;