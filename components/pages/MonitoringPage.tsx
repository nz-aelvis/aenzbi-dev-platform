
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface Feature {
  title: string;
  description: string;
}

const MonitoringPage: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (!process.env.API_KEY) throw new Error("API key not configured.");
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = "Generate a list of 3 key features for a Security & Monitoring service on the Aenzbi developer platform. Provide a title and a short description for each feature.";
        
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
            { title: "Real-Time Performance Monitoring", description: "Track your application's health, response times, and error rates with our intuitive dashboards." },
            { title: "DDoS Protection", description: "Enterprise-grade protection against distributed denial-of-service attacks to ensure your application stays online." },
            { title: "Automated Security Audits", description: "Receive regular, automated security scans and reports to identify and patch vulnerabilities proactively." }
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
          Security & Monitoring
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-400">
          Keep your applications secure with enterprise-grade protection and real-time performance analytics.
        </p>
      </div>
       <div className="mt-16 max-w-4xl mx-auto">
        {isLoading ? (
            <div className="space-y-8">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-900 p-6 rounded-lg animate-pulse">
                        <div className="h-6 bg-gray-800 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-gray-800 rounded w-full"></div>
                        <div className="h-4 bg-gray-800 rounded w-3/4 mt-2"></div>
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

export default MonitoringPage;