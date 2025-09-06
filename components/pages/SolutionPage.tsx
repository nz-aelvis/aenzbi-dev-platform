
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface Solution {
  title: string;
  description: string;
}

const SolutionPage: React.FC = () => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (!process.env.API_KEY) throw new Error("API key not configured.");
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = "Generate a list of 3 'Solutions' for different customer types on the Aenzbi developer platform (e.g., startups, enterprises). Provide a title and a short description for each solution.";
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        solutions: {
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
        setSolutions(data.solutions);
      } catch (error) {
        console.error("Failed to fetch page content:", error);
        setSolutions([
            { title: "Solution for Startups", description: "Launch faster with our all-in-one platform. Go from idea to production in record time with scalable infrastructure that grows with you." },
            { title: "Solution for Enterprises", description: "Enhance productivity and ensure governance with our secure, reliable platform. Benefit from dedicated support and enterprise-grade features." },
            { title: "Solution for Agencies", description: "Manage multiple client projects effortlessly. Standardize your stack, streamline deployments, and collaborate efficiently with your team." }
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
          Solutions
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-400">
          Tailored solutions for startups, enterprises, and individual developers to accelerate growth.
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
                {solutions.map((solution, index) => (
                    <div key={index} className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
                        <h3 className="text-2xl font-bold text-brand-blue">{solution.title}</h3>
                        <p className="mt-2 text-gray-300">{solution.description}</p>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default SolutionPage;