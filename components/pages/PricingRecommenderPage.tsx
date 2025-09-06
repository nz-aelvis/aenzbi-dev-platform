
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const PricingRecommenderPage: React.FC = () => {
  const [description, setDescription] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getRecommendation = async () => {
    if (!description) {
        setError("Please describe your project needs.");
        return;
    }
    setIsLoading(true);
    setRecommendation('');
    setError('');

    try {
        if (!process.env.API_KEY) throw new Error("API key not configured.");
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `A user is looking for a pricing plan for the Aenzbi developer platform. Here are the plans:
        - Starter ($29/month): For individual developers, 5 projects, 100GB storage.
        - Pro ($99/month): For growing teams, unlimited projects, 1TB storage, priority support, team collaboration.
        - Enterprise (Custom): For large organizations, unlimited everything, dedicated support, SLA.

        Based on the user's project description, recommend one plan and provide a brief explanation for your choice.
        User description: "${description}"`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        setRecommendation(response.text);
    } catch (err) {
        console.error("Failed to get recommendation:", err);
        setError("Sorry, we couldn't generate a recommendation at this time.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
          AI Pricing Recommender
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-400">
          Not sure which plan is right for you? Describe your project, team size, and goals, and our AI assistant will suggest the perfect fit.
        </p>
      </div>

      <div className="mt-12 max-w-2xl mx-auto bg-gray-900 border border-gray-800 rounded-lg p-8 space-y-6">
        <div>
          <label htmlFor="description" className="block text-lg font-medium text-white mb-2">
            Describe your needs:
          </label>
          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., I'm a solo developer working on a personal blog..."
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>
        <button
          onClick={getRecommendation}
          disabled={isLoading}
          className="w-full bg-brand-blue text-white font-semibold rounded-lg px-6 py-3 text-center transition duration-300 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Get Recommendation'}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
        
        {recommendation && (
            <div className="mt-8 border-t border-gray-700 pt-6">
                <h3 className="text-2xl font-bold text-white mb-4">Our Recommendation:</h3>
                <div className="bg-gray-800 p-6 rounded-lg whitespace-pre-wrap">
                    <p className="text-gray-300">{recommendation}</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default PricingRecommenderPage;