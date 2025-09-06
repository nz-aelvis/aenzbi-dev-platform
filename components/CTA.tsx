
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

interface FormData {
    name: string;
    email: string;
    company: string;
    phone: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
}

const CTA: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '', email: '', company: '', phone: '', message: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [aiKeywords, setAiKeywords] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const maxLength = 500;

    const validateField = (name: keyof FormData, value: string): string => {
        switch (name) {
            case 'name': return value.trim() ? '' : 'Name is required.';
            case 'email':
                if (!value.trim()) return 'Email is required.';
                if (!/\S+@\S+\.\S+/.test(value)) return 'Email address is invalid.';
                return '';
            case 'phone': return value.trim() ? '' : 'Phone number is required.';
            default: return '';
        }
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target as { name: keyof FormData; value: string };
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error || undefined }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target as { name: keyof FormData; value: string };
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleAiAssist = async () => {
        if (!aiKeywords) return;
        setIsGenerating(true);
        try {
            if (!process.env.API_KEY) throw new Error("API key not configured.");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Based on these keywords: "${aiKeywords}", write a professional project description for a consultation request for the Aenzbi developer platform. The message should be friendly, concise, and under ${maxLength} characters.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setFormData(prev => ({ ...prev, message: response.text }));
        } catch (error) {
            console.error("AI assist failed:", error);
            setFormData(prev => ({ ...prev, message: "Error generating message. Please write your own."}));
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: FormErrors = {};
        let isValid = true;
        const requiredFields: Array<keyof FormErrors> = ['name', 'email', 'phone'];

        requiredFields.forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });
        
        setErrors(newErrors);

        if (isValid) {
            console.log('Form is valid. Submitting...', formData);
        } else {
            console.log('Form is invalid.');
        }
    };

    return (
        <section className="py-20 sm:py-24 lg:py-32 bg-black">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                            Ready to Build Something Amazing?
                        </h2>
                        <p className="mt-4 text-lg text-gray-400">
                            Join thousands of developers who trust Aenzbi for their development, hosting, and deployment needs.
                        </p>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                        <h3 className="text-xl font-bold text-white mb-6">Schedule Consultation</h3>
                        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} onBlur={handleBlur} className={`w-full bg-gray-800 border rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue ${errors.name ? 'border-red-500' : 'border-gray-700'}`} />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <input type="email" name="email" placeholder="john@company.com" value={formData.email} onChange={handleChange} onBlur={handleBlur} className={`w-full bg-gray-800 border rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue ${errors.email ? 'border-red-500' : 'border-gray-700'}`} />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input type="text" name="company" placeholder="Your Company" value={formData.company} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                                <div>
                                    <input type="tel" name="phone" placeholder="+1 (555) 123-4567" value={formData.phone} onChange={handleChange} onBlur={handleBlur} className={`w-full bg-gray-800 border rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue ${errors.phone ? 'border-red-500' : 'border-gray-700'}`} />
                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                </div>
                            </div>
                             <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <input type="text" value={aiKeywords} onChange={(e) => setAiKeywords(e.target.value)} placeholder="Enter keywords for AI..." className="flex-grow bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm" />
                                    <button type="button" onClick={handleAiAssist} disabled={isGenerating} className="bg-gray-700 text-white font-semibold rounded-lg px-4 py-2 text-sm transition hover:bg-gray-600 disabled:opacity-50">AI Assist</button>
                                </div>
                                <textarea rows={4} name="message" value={formData.message} onChange={handleChange} maxLength={maxLength} placeholder="Tell us about your project and goals..." className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue"></textarea>
                                <p className="text-right text-sm text-gray-500 mt-1">{formData.message.length}/{maxLength} characters</p>
                            </div>
                            <button type="submit" className="w-full bg-brand-blue text-white font-semibold rounded-lg px-6 py-3 text-center transition duration-300 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed">
                                Schedule Consultation
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;