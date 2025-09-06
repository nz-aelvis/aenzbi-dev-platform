import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface Feature {
  title: string;
  description: string;
}

const MobileSdkPage: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (!process.env.API_KEY) throw new Error("API key not configured.");
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = "Generate content for a product page about the 'Aenzbi Mobile SDK'. Mention it's for building cross-platform mobile business management apps, inspired by the original 'Aenzbi-app' built with React Native. Generate a list of 3 key features with a title and a short description for each.";
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        features: {
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
        setFeatures(data.features);
      } catch (error) {
        console.error("Failed to fetch page content:", error);
        setFeatures([
            { title: "Powered by React Native", description: "Leverage the power and flexibility of React Native to build beautiful, high-performance native apps for both iOS and Android from a single codebase." },
            { title: "Business Logic Included", description: "Get a head start with pre-built modules for common business tasks like real-time sales tracking, stock transactions, and user management." },
            { title: "Offline-First Synchronization", description: "Build reliable apps that work even without an internet connection. Data automatically syncs with the cloud once connectivity is restored." }
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
          Mobile SDK
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-400">
          Create powerful, cross-platform mobile applications for business management with our feature-rich SDK.
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
                {features.map((feature, index) => (
                    <div key={index} className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
                        <h3 className="text-2xl font-bold text-brand-blue">{feature.title}</h3>
                        <p className="mt-2 text-gray-300">{feature.description}</p>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default MobileSdkPage;
