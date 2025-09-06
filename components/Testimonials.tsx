
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface Testimonial {
    quote: string;
    name: string;
    title: string;
    initials: string;
}

const initialTestimonials: Testimonial[] = [
    {
        quote: "Aenzbi transformed our development workflow. The integrated platform saved us months of setup time and the deployment process is seamless.",
        name: "Sarah Johnson",
        title: "Lead Developer, TechCorp",
        initials: "SJ"
    },
    {
        quote: "The training programs are exceptional. I went from junior to senior developer in 8 months thanks to Aenzbi's comprehensive curriculum.",
        name: "Michael Rodriguez",
        title: "Full Stack Developer",
        initials: "MR"
    },
    {
        quote: "Outstanding platform reliability and support. Our apps have 99.9% uptime and the global CDN makes everything lightning fast.",
        name: "Alex Liu",
        title: "CTO, StartupXYZ",
        initials: "AL"
    }
];

const Testimonials: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
    const [isLoading, setIsLoading] = useState(false);

    const generateTestimonial = async () => {
        setIsLoading(true);
        try {
            if (!process.env.API_KEY) throw new Error("API key not configured.");

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Generate one new, unique, and positive testimonial for a developer platform called Aenzbi. The testimonial should be from a fictional person with a realistic name, title, and company. It should highlight a specific feature like App Builder, Cloud Hosting, or Developer Training.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            quote: { type: Type.STRING, description: "The testimonial quote." },
                            name: { type: Type.STRING, description: "Full name of the person." },
                            title: { type: Type.STRING, description: "Job title of the person." },
                        }
                    }
                }
            });

            const jsonResponse = JSON.parse(response.text);
            const nameParts = jsonResponse.name.split(' ');
            const initials = nameParts.length > 1 ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase() : nameParts[0].substring(0, 2).toUpperCase();

            const newTestimonial: Testimonial = {
                ...jsonResponse,
                initials: initials
            };
            
            // Add to the start of the list for visibility
            setTestimonials(prev => [newTestimonial, ...prev]);

        } catch (error) {
            console.error("Failed to generate testimonial:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="py-20 sm:py-24 lg:py-32 bg-black">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
                        Trusted by Developers Worldwide
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                        See what developers and teams are saying about Aenzbi
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-8 flex flex-col transition-all duration-500">
                            <p className="text-gray-300 flex-grow">"{testimonial.quote}"</p>
                            <div className="mt-8 flex items-center">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-blue flex items-center justify-center font-bold text-white">
                                    {testimonial.initials}
                                </div>
                                <div className="ml-4">
                                    <p className="font-semibold text-white">{testimonial.name}</p>
                                    <p className="text-gray-400">{testimonial.title}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-16">
                    <button onClick={generateTestimonial} disabled={isLoading} className="bg-gray-800 text-white font-semibold rounded-lg px-8 py-3 text-center transition duration-300 ease-in-out hover:bg-gray-700 border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? "Generating..." : "Generate another testimonial"}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;