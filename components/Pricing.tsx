
import React from 'react';

const Pricing: React.FC = () => {
    return (
        <section id="pricing" className="py-20 sm:py-24 lg:py-32 bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                        Choose the perfect plan for your development needs. Scale up or down anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    {/* Starter Plan */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 flex flex-col">
                        <h3 className="text-2xl font-bold text-white">Starter</h3>
                        <p className="mt-2 text-gray-400">Perfect for individual developers</p>
                        <p className="mt-6 text-5xl font-extrabold text-white">$29<span className="text-lg font-medium text-gray-400">/month</span></p>
                        <ul className="mt-8 space-y-4 text-gray-400 flex-grow">
                            <li>5 Projects</li>
                            <li>100GB Storage</li>
                            <li>Basic Support</li>
                            <li>SSL Certificates</li>
                            <li>Global CDN</li>
                        </ul>
                        <a href="#" className="mt-8 w-full block bg-gray-700 text-white font-semibold rounded-lg px-6 py-3 text-center transition duration-300 hover:bg-gray-600">
                            Get Started
                        </a>
                    </div>

                    {/* Pro Plan */}
                    <div className="relative bg-brand-blue/10 border-2 border-brand-blue rounded-lg p-8 flex flex-col shadow-2xl shadow-blue-500/20">
                        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                            <span className="inline-flex items-center px-4 py-1 bg-brand-blue text-white text-sm font-semibold tracking-wide rounded-full">Most Popular</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white">Pro</h3>
                        <p className="mt-2 text-gray-400">For growing teams and businesses</p>
                        <p className="mt-6 text-5xl font-extrabold text-white">$99<span className="text-lg font-medium text-gray-400">/month</span></p>
                        <ul className="mt-8 space-y-4 text-gray-400 flex-grow">
                            <li>Unlimited Projects</li>
                            <li>1TB Storage</li>
                            <li>Priority Support</li>
                            <li>Advanced Analytics</li>
                            <li>Team Collaboration</li>
                            <li>Custom Domains</li>
                        </ul>
                        <a href="#" className="mt-8 w-full block bg-brand-blue text-white font-semibold rounded-lg px-6 py-3 text-center transition duration-300 hover:bg-blue-700">
                            Start Pro Trial
                        </a>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 flex flex-col">
                        <h3 className="text-2xl font-bold text-white">Enterprise</h3>
                        <p className="mt-2 text-gray-400">For large organizations</p>
                        <p className="mt-6 text-5xl font-extrabold text-white">Custom</p>
                        <ul className="mt-8 space-y-4 text-gray-400 flex-grow">
                            <li>Unlimited Everything</li>
                            <li>Dedicated Support</li>
                            <li>SLA Guarantees</li>
                            <li>Custom Integrations</li>
                            <li>On-premise Options</li>
                        </ul>
                        <a href="#" className="mt-8 w-full block bg-gray-700 text-white font-semibold rounded-lg px-6 py-3 text-center transition duration-300 hover:bg-gray-600">
                            Contact Sales
                        </a>
                    </div>
                </div>

                <div className="text-center mt-16">
                     <a href="/#/pricing-recommender" className="inline-block bg-transparent border border-brand-blue text-brand-blue font-semibold rounded-lg px-8 py-3 text-center transition duration-300 ease-in-out hover:bg-brand-blue hover:text-white">
                        Help Me Choose
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Pricing;