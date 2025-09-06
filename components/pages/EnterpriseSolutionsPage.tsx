import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface Offering {
  title: string;
  description: string;
}

const EnterpriseSolutionsPage: React.FC = () => {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (!process.env.API_KEY) throw new Error("API key not configured.");
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = "Generate content for a page about 'Enterprise Solutions' on the Aenzbi developer platform. This should cover custom development, strategic consulting, and team augmentation for large organizations. Generate a list of 3 key offerings with a title and a short description for each.";
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        offerings: {
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
        setOfferings(data.offerings);
      } catch (error) {
        console.error("Failed to fetch page content:", error);
        setOfferings([
            { title: "Strategic Technology Consulting", description: "Partner with our architects to design scalable systems, optimize your cloud strategy, and implement best practices for security and compliance." },
            { title: "Custom Feature & Application Development", description: "Our expert engineering team can build bespoke features, complex integrations, or entire applications on top of the Aenzbi platform to meet your unique business needs." },
            { title: "Developer Team Augmentation", description: "Embed our senior Aenzbi developers directly into your teams to accelerate project timelines, transfer knowledge, and upskill your existing talent." }
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
          Enterprise Solutions
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-400">
          Dedicated solutions, expert consulting, and custom development to help your organization succeed at scale.
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
                {offerings.map((offering, index) => (
                    <div key={index} className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
                        <h3 className="text-2xl font-bold text-brand-blue">{offering.title}</h3>
                        <p className="mt-2 text-gray-300">{offering.description}</p>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default EnterpriseSolutionsPage;
