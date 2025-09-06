
import React from 'react';

const Status: React.FC = () => {
    const statusItems = [
        { value: '99.9%', label: 'Uptime' },
        { value: '100ms', label: 'Response Time' },
        { value: '50+', label: 'Global Regions' },
        { value: '24/7', label: 'Support' }
    ];

    return (
        <section className="py-16 bg-black">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Platform Status</h3>
                    <div className="inline-flex items-center bg-green-900/50 text-green-300 rounded-full px-4 py-1 text-sm font-medium border border-green-700">
                        <span className="w-2 h-2 mr-2 bg-green-400 rounded-full"></span>
                        All Systems Operational
                    </div>
                </div>
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {statusItems.map((item, index) => (
                        <div key={index}>
                            <p className="text-4xl font-extrabold text-white">{item.value}</p>
                            <p className="mt-1 text-gray-400">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Status;