
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface DocSection {
  title: string;
  description: string;
}

const DocumentationPage: React.FC = () => {
  const [sections, setSections] = useState<DocSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (!process.env.API_KEY) throw new Error("API key not configured.");
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = "Generate a list of 3 key sections for the Documentation page on the Aenzbi developer platform. Provide a title and a short description for each section.";
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        sections: {
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
        setSections(data.sections);
      } catch (error) {
        console.error("Failed to fetch page content:", error);
        setSections([
            { title: "Getting Started Guide", description: "Follow our step-by-step tutorial to create and deploy your first application on Aenzbi." },
            { title: "API Reference", description: "Explore detailed documentation for our platform's REST and GraphQL APIs, including endpoints and examples." },
            { title: "Platform Services", description: "Deep dive into the specifics of each service, from Cloud Hosting configurations to CI/CD pipeline setup." }
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
          Documentation
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-400">
          Explore our comprehensive guides, API references, and tutorials to get the most out of the Aenzbi platform.
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
                {sections.map((section, index) => (
                    <div key={index} className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
                        <h3 className="text-2xl font-bold text-brand-blue">{section.title}</h3>
                        <p className="mt-2 text-gray-300">{section.description}</p>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default DocumentationPage;