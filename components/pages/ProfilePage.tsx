import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { UserCircleIcon, SparklesIcon } from '../icons';

const ProfilePage: React.FC = () => {
  const [avatarPrompt, setAvatarPrompt] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  
  const [bioKeywords, setBioKeywords] = useState('');
  const [generatedBio, setGeneratedBio] = useState('');
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  const handleGenerateAvatar = async () => {
    if (!avatarPrompt) return;
    setIsGeneratingAvatar(true);
    setAvatarError(null);
    try {
        if (!process.env.API_KEY) throw new Error("API key not configured.");
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A professional, clean, circular profile avatar based on the following description: "${avatarPrompt}". Vector art style.`,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '1:1',
            },
        });
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        setAvatarUrl(`data:image/png;base64,${base64ImageBytes}`);
    } catch (error) {
        console.error("Avatar generation failed:", error);
        setAvatarError("Failed to generate avatar. Please try again.");
    } finally {
        setIsGeneratingAvatar(false);
    }
  };

  const handleGenerateBio = async () => {
    if (!bioKeywords) return;
    setIsGeneratingBio(true);
    try {
        if (!process.env.API_KEY) throw new Error("API key not configured.");
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Write a professional and engaging user bio for a developer platform profile. The bio should be around 3-4 sentences and based on these keywords: "${bioKeywords}".`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        setGeneratedBio(response.text);
    } catch (error) {
        console.error("Bio generation failed:", error);
        setGeneratedBio("Could not generate bio. Please try different keywords.");
    } finally {
        setIsGeneratingBio(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
          Your Profile
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-400">
          Personalize your Aenzbi profile with our AI-powered tools.
        </p>
      </div>

      <div className="mt-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Profile Card & Avatar Generator */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Profile Details</h2>
            <div className="flex flex-col items-center text-center">
                {isGeneratingAvatar ? (
                     <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center animate-pulse">
                        <svg className="w-10 h-10 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                     </div>
                ) : avatarUrl ? (
                    <img src={avatarUrl} alt="Generated Avatar" className="w-32 h-32 rounded-full object-cover border-2 border-brand-blue" />
                ) : (
                    <UserCircleIcon className="w-32 h-32 text-gray-700" />
                )}
                 {avatarError && <p className="text-red-500 text-sm mt-2">{avatarError}</p>}
                <p className="mt-4 text-xl font-semibold text-white">John Doe</p>
                <p className="text-gray-400">john@company.com</p>
            </div>
            
            <div className="border-t border-gray-800 pt-6 space-y-4">
                 <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-brand-blue" />
                    AI Avatar Generator
                </h3>
                <input
                    type="text"
                    value={avatarPrompt}
                    onChange={(e) => setAvatarPrompt(e.target.value)}
                    placeholder="e.g., a pixel art cat wearing headphones"
                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                <button
                    onClick={handleGenerateAvatar}
                    disabled={isGeneratingAvatar}
                    className="w-full bg-brand-blue text-white font-semibold rounded-lg px-6 py-2 text-center transition duration-300 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {isGeneratingAvatar ? 'Generating...' : 'Generate Avatar'}
                </button>
            </div>
        </div>

        {/* Bio Generator */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 space-y-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-brand-blue" />
                AI Bio Assistant
            </h3>
            <div>
              <label htmlFor="bio-keywords" className="block text-sm font-medium text-gray-300 mb-2">
                Enter a few keywords about yourself:
              </label>
              <input
                  id="bio-keywords"
                  type="text"
                  value={bioKeywords}
                  onChange={(e) => setBioKeywords(e.target.value)}
                  placeholder="e.g., React, full-stack, cloud enthusiast"
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <button
                onClick={handleGenerateBio}
                disabled={isGeneratingBio}
                className="w-full bg-gray-700 text-white font-semibold rounded-lg px-6 py-2 text-center transition duration-300 hover:bg-gray-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                {isGeneratingBio ? 'Generating...' : 'Generate Bio'}
            </button>
            <div>
              <label htmlFor="generated-bio" className="block text-sm font-medium text-gray-300 mb-2">
                Your Generated Bio:
              </label>
              <textarea
                  id="generated-bio"
                  rows={6}
                  value={generatedBio}
                  readOnly
                  placeholder="Your AI-generated bio will appear here..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
