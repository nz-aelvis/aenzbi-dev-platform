
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const PlatformOverview: React.FC = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const generateImage = async () => {
            try {
                if (!process.env.API_KEY) {
                    throw new Error("API key not configured.");
                }
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const response = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: 'A modern, abstract visualization of a global developer platform, with interconnected nodes and data streams on a world map. Dark theme with blue and purple neon accents. Photorealistic, cinematic lighting.',
                    config: {
                        numberOfImages: 1,
                        outputMimeType: 'image/jpeg',
                        aspectRatio: '4:3',
                    },
                });
                const base64ImageBytes = response.generatedImages[0].image.imageBytes;
                setImageUrl(`data:image/jpeg;base64,${base64ImageBytes}`);
            } catch (error) {
                console.error("Image generation failed:", error);
                setImageUrl("https://picsum.photos/600/400?grayscale"); // Fallback
            } finally {
                setIsLoading(false);
            }
        };

        generateImage();
    }, []);

    return (
        <section className="py-20 sm:py-24 lg:py-32 bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="text-brand-blue font-semibold">Powerful Platform</span>
                        <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
                            Everything You Need in One Platform
                        </h2>
                        <p className="mt-4 text-lg text-gray-400">
                            Aenzbi combines the power of modern development tools with the simplicity of a unified platform. Build faster, deploy easier, and scale without limits.
                        </p>
                        <ul className="mt-8 space-y-6">
                            <li className="flex">
                                <svg className="flex-shrink-0 h-6 w-6 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div className="ml-3">
                                    <h4 className="text-lg font-semibold text-white">Integrated Development Environment</h4>
                                    <p className="text-gray-400">Code, test, and deploy from a single interface</p>
                                </div>
                            </li>
                            <li className="flex">
                                <svg className="flex-shrink-0 h-6 w-6 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div className="ml-3">
                                    <h4 className="text-lg font-semibold text-white">Scalable Infrastructure</h4>
                                    <p className="text-gray-400">Auto-scaling resources that grow with your needs</p>
                                </div>
                            </li>
                            <li className="flex">
                                <svg className="flex-shrink-0 h-6 w-6 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div className="ml-3">
                                    <h4 className="text-lg font-semibold text-white">Global Edge Network</h4>
                                    <p className="text-gray-400">Lightning-fast performance worldwide</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="mt-10 lg:mt-0">
                        {isLoading ? (
                            <div className="aspect-[4/3] bg-gray-800 rounded-lg shadow-xl animate-pulse"></div>
                        ) : (
                            <img className="rounded-lg shadow-xl" src={imageUrl!} alt="AI-generated platform overview" />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PlatformOverview;