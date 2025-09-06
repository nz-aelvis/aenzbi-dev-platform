import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

const loadingMessages = [
    "Initializing video generation...",
    "Crafting the visuals...",
    "Assembling the demo...",
    "Applying high-tech aesthetic...",
    "Finalizing the experience...",
    "Almost ready..."
];

const VideoDemo: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [userKeyword, setUserKeyword] = useState('');
    const [isRateLimited, setIsRateLimited] = useState(false); // New state for rate limiting
    const messageIntervalRef = useRef<number | null>(null);

    const startLoadingMessages = () => {
        let messageIndex = 0;
        messageIntervalRef.current = window.setInterval(() => {
            messageIndex = (messageIndex + 1) % loadingMessages.length;
            setLoadingMessage(loadingMessages[messageIndex]);
        }, 3000);
    };

    const stopLoadingMessages = () => {
        if (messageIntervalRef.current) {
            clearInterval(messageIntervalRef.current);
        }
    };

    const generateVideo = async () => {
        setIsLoading(true);
        setError(null);
        setIsRateLimited(false); // Reset on a new attempt
        if (videoUrl) {
            URL.revokeObjectURL(videoUrl);
            setVideoUrl(null);
        }
        startLoadingMessages();

        try {
            if (!process.env.API_KEY) {
                throw new Error("API key is not configured.");
            }

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const basePrompt = "A dynamic and futuristic promotional video for the Aenzbi developer platform. Showcasing a seamless workflow from coding on a sleek dark-mode interface, to one-click deployment to a global network represented by glowing nodes on a world map. The video should have a modern, high-tech aesthetic with blue and purple neon accents, conveying speed, reliability, and innovation.";
            const finalPrompt = userKeyword ? `${basePrompt} The video should have a theme related to ${userKeyword}.` : basePrompt;
            
            let operation = await ai.models.generateVideos({
                model: 'veo-2.0-generate-001',
                prompt: finalPrompt,
                config: {
                    numberOfVideos: 1
                }
            });

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                if (!videoResponse.ok) {
                    throw new Error(`got status: ${videoResponse.status} ${videoResponse.statusText}. ${await videoResponse.text()}`);
                }
                const videoBlob = await videoResponse.blob();
                const url = URL.createObjectURL(videoBlob);
                setVideoUrl(url);
            } else {
                throw new Error("Video generation did not return a valid download link.");
            }

        } catch (err) {
            console.error("Video generation failed:", err);
            let errorMessage = "An unknown error occurred during video generation.";
            if (err instanceof Error) {
                if (err.message.includes("429") || err.message.includes("RESOURCE_EXHAUSTED")) {
                    errorMessage = "The video demo is currently unavailable due to high demand. You've exceeded the API quota. Please try again later.";
                    setIsRateLimited(true); // Set rate limit flag
                } else if (err.message.includes("API key is not configured")) {
                    errorMessage = "This feature is not available. API key is missing.";
                } else {
                    errorMessage = "An error occurred while generating the video demo.";
                }
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
            stopLoadingMessages();
        }
    };
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="aspect-video bg-gray-900 border border-gray-800 rounded-lg flex flex-col items-center justify-center text-center p-8">
                    <svg className="animate-spin h-12 w-12 text-brand-blue mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <h3 className="text-xl font-semibold text-white">Generating Your Platform Demo</h3>
                    <p className="text-gray-400 mt-2">{loadingMessage}</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="aspect-video bg-gray-900 border border-gray-800 rounded-lg flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
                    <img className="absolute top-0 left-0 w-full h-full object-cover opacity-10" src="https://picsum.photos/600/400?grayscale" alt="Platform dashboard fallback" />
                    <div className="relative z-10">
                        <h3 className="text-xl font-semibold text-yellow-400">Demo Temporarily Unavailable</h3>
                        <p className="text-gray-400 mt-2 max-w-md">{error}</p>
                    </div>
                </div>
            );
        }

        if (videoUrl) {
            return (
                <video className="w-full h-full rounded-lg shadow-2xl shadow-blue-500/20 border border-gray-800" src={videoUrl} controls autoPlay muted loop playsInline />
            );
        }

        return (
             <div className="aspect-video bg-gray-900 border border-gray-800 rounded-lg flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
                <img className="absolute top-0 left-0 w-full h-full object-cover opacity-10" src="https://picsum.photos/600/400?grayscale" alt="Platform dashboard placeholder" />
                <p className="relative z-10 text-lg text-gray-300">Enter a keyword to generate a personalized demo.</p>
            </div>
        );
    };

    return (
        <section className="py-20 sm:py-24 lg:py-32 bg-black">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
                        See Aenzbi in Action
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                        Enter a keyword (e.g., "gaming", "e-commerce") to generate a platform demo tailored to your industry.
                    </p>
                </div>
                 <div className="max-w-xl mx-auto flex items-center gap-4 mb-8">
                    <input
                        type="text"
                        value={userKeyword}
                        onChange={(e) => setUserKeyword(e.target.value)}
                        placeholder="Enter a keyword (optional)"
                        className="flex-grow bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                    <button
                        onClick={generateVideo}
                        disabled={isLoading || isRateLimited}
                        className="bg-brand-blue text-white font-semibold rounded-lg px-6 py-2 text-center transition duration-300 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Generating..." : (isRateLimited ? "Quota Reached" : "Generate Demo")}
                    </button>
                </div>
                <div className="max-w-4xl mx-auto">
                    {renderContent()}
                </div>
            </div>
        </section>
    );
};

export default VideoDemo;