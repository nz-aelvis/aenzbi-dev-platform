
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface SystemStatus {
  name: string;
  status: 'Operational' | 'Degraded Performance' | 'Outage';
}

const StatusPage: React.FC = () => {
  const [systems, setSystems] = useState<SystemStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // In a real app, this would fetch from a status API.
        // Here, we use AI to generate a realistic list of systems.
        if (!process.env.API_KEY) throw new Error("API key not configured.");
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = "Generate a list of 4 key systems for a developer platform's status page. Examples: API, App Builder, Cloud Hosting. For each, set the status to 'Operational'.";
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        systems: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    status: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });

        const data = JSON.parse(response.text);
        setSystems(data.systems);
      } catch (error) {
        console.error("Failed to fetch page content:", error);
        setSystems([
            { name: "Platform API", status: "Operational" },
            { name: "App Builder", status: "Operational" },
            { name: "Cloud Hosting", status: "Operational" },
            { name: "Deployment Services", status: "Operational" }
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
          Platform Status
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-400">
          Check the real-time status of all Aenzbi services and infrastructure.
        </p>
         <div className="mt-12 inline-flex items-center bg-green-900/50 text-green-300 rounded-full px-6 py-2 text-lg font-medium border border-green-700">
            <span className="w-3 h-3 mr-3 bg-green-400 rounded-full animate-pulse"></span>
            All Systems Operational
        </div>
      </div>
      <div className="mt-16 max-w-2xl mx-auto border border-gray-800 rounded-lg">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-900 rounded-lg animate-pulse"></div>)}
          </div>
        ) : (
          systems.map((system, index) => (
            <div key={index} className={`flex justify-between items-center p-4 ${index < systems.length - 1 ? 'border-b border-gray-800' : ''}`}>
              <span className="text-lg text-gray-300">{system.name}</span>
              <span className="text-green-400 font-semibold">{system.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StatusPage;