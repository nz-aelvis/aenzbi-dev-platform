
import React from 'react';

const stats = [
    { value: '50K+', label: 'Active Developers' },
    { value: '1M+', label: 'Apps Deployed' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '150+', label: 'Countries Served' }
];

const Stats: React.FC = () => {
    return (
        <section className="bg-gray-900 py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <div key={index}>
                            <p className="text-4xl lg:text-5xl font-extrabold text-white">{stat.value}</p>
                            <p className="mt-2 text-lg text-gray-400">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;