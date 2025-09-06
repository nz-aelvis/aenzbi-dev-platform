import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface ContentSection {
  title: string;
  content: string;
}

const AboutUsPage: React.FC = () => {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (!process.env.API_KEY) throw new Error("API key not configured.");
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Based on the following information, write the content for an 'About Us' page for a developer platform called Aenzbi. The tone should be professional, inspiring, and focused on the company's origin and mission. Create two sections: one for 'Our Story' and one for 'Our Founder'. In 'Our Story', explain how initial projects like AenzbiStudio and Aenzbi POS grew into the comprehensive platform it is today. In 'Our Founder', write a brief bio about Ally Elvis Nzeyimana and his vision.

        Information: "Aenzbi" refers to a collection of cross-platform software solutions, including a POS and eCommerce system, a mobile business management app, and a cross-platform Integrated Development Environment (IDE) called AenzbiStudio, all developed by Ally Elvis Nzeyimana. The Aenzbi suite aims to provide businesses with tools for managing sales, inventory, and overall operations.`;
        
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
                                    content: { type: Type.STRING }
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
            { title: "Our Story", content: "Aenzbi began as a collection of powerful, cross-platform software solutions designed to solve real-world business challenges. From the versatile AenzbiStudio IDE to the robust eCommerce & POS system, each component was built with a developer-first mindset. As these tools evolved, they converged into the unified, comprehensive platform you see today, dedicated to empowering developers to build, deploy, and scale without limits." },
            { title: "Our Founder", content: "Aenzbi was founded by Ally Elvis Nzeyimana, a visionary developer with a passion for creating seamless, cross-platform tools. His initial projects laid the groundwork for Aenzbi's core mission: to provide an integrated ecosystem that streamlines the entire development lifecycle, enabling businesses and developers to achieve their goals more efficiently." }
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
          About Aenzbi
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-400">
          Empowering developers with a unified platform, born from a passion for innovation and efficiency.
        </p>
      </div>
      <div className="mt-16 max-w-4xl mx-auto">
        {isLoading ? (
            <div className="space-y-8">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-gray-900 p-6 rounded-lg animate-pulse">
                        <div className="h-6 bg-gray-800 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-gray-800 rounded w-full"></div>
                        <div className="h-4 bg-gray-800 rounded w-3/4 mt-2"></div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="space-y-12">
                {sections.map((section, index) => (
                    <div key={index} className="bg-gray-900 border border-gray-800 p-8 rounded-lg">
                        <h3 className="text-3xl font-bold text-brand-blue">{section.title}</h3>
                        <p className="mt-4 text-gray-300 leading-relaxed whitespace-pre-wrap">{section.content}</p>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default AboutUsPage;
