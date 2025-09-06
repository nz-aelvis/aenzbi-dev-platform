
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface SupportOption {
  title: string;
  description: string;
}

const SupportPage: React.FC = () => {
  const [options, setOptions] = useState<SupportOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (!process.env.API_KEY) throw new Error("API key not configured.");
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = "Generate a list of 3 support options for the Support page on the Aenzbi developer platform. Provide a title and a short description for each option.";
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        options: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });

        const data = JSON.parse(response.text);
        setOptions(data.options);
      } catch (error) {
        console.error("Failed to fetch page content:", error);
        setOptions([
            { title: "Community Forum", description: "Ask questions and share knowledge with other Aenzbi developers in our active community forum." },
            { title: "Ticket Support", description: "Submit a support ticket for technical issues and get a response from our expert team within 24 hours (Pro and Enterprise)." },
            { title: "Live Chat", description: "Get instant help with your questions via live chat, available 24/7 for Enterprise plan customers." }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
          Support
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-400">
          Get help from our expert support team. We're here 24/7 to assist you with any questions or issues.
        </p>
      </div>
      <div className="mt-16 max-w-4xl mx-auto">
        {isLoading ? (
            <div className="space-y-8">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-900 p-6 rounded-lg animate-pulse">
                        <div className="h-6 bg-gray-800 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-gray-800 rounded w-full"></div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="space-y-8">
                {options.map((option, index) => (
                    <div key={index} className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
                        <h3 className="text-2xl font-bold text-brand-blue">{option.title}</h3>
                        <p className="mt-2 text-gray-300">{option.description}</p>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default SupportPage;