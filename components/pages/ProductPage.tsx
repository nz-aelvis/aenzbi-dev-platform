
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface Pillar {
  title: string;
  description: string;
}

const ProductPage: React.FC = () => {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (!process.env.API_KEY) throw new Error("API key not configured.");
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = "Generate a list of 3 key 'Product Pillars' for the Aenzbi developer platform. Provide a title and a short description for each pillar.";
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        pillars: {
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
        setPillars(data.pillars);
      } catch (error) {
        console.error("Failed to fetch page content:", error);
        setPillars([
            { title: "Unified Workflow", description: "From coding to deployment, all tools are integrated into one seamless experience to maximize productivity." },
            { title: "Infinite Scalability", description: "Built on serverless architecture, our platform scales effortlessly to handle any workload without manual intervention." },
            { title: "Developer-Centric Experience", description: "Designed by developers, for developers, with a focus on clean APIs, comprehensive documentation, and powerful CLI tools." }
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
          Our Product
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-400">
          Discover the features and capabilities of the Aenzbi integrated developer platform.
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
                {pillars.map((pillar, index) => (
                    <div key={index} className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
                        <h3 className="text-2xl font-bold text-brand-blue">{pillar.title}</h3>
                        <p className="mt-2 text-gray-300">{pillar.description}</p>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;