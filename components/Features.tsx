
import React, { useState, useRef, useEffect } from 'react';
import { 
    CodeBracketIcon, 
    ShoppingCartIcon,
    DevicePhoneMobileIcon,
    CloudIcon, 
    TemplateIcon, 
    BuildingOfficeIcon 
} from './icons';

interface Feature {
    icon: React.ElementType;
    title: string;
    description: string;
    points: string[];
    link: string;
}

const features: Feature[] = [
    {
        icon: CodeBracketIcon,
        title: 'AenzbiStudio IDE',
        description: 'A powerful, cross-platform IDE for Android, Windows, and the cloud.',
        points: ['Unified development environment', 'Cloud-synced workspaces', 'Integrated debugging tools', 'Extensible plugin architecture'],
        link: '/#/studio'
    },
    {
        icon: ShoppingCartIcon,
        title: 'eCommerce & POS Suite',
        description: 'A comprehensive system for managing online sales, inventory, and accounting.',
        points: ['Real-time inventory sync', 'Integrated payment gateways', 'Customer relationship management', 'EBMS integration support'],
        link: '/#/pos'
    },
    {
        icon: DevicePhoneMobileIcon,
        title: 'Mobile SDK',
        description: 'Build powerful, cross-platform mobile apps for business management.',
        points: ['React Native based', 'Real-time data synchronization', 'Offline capabilities', 'Pre-built business modules'],
        link: '/#/mobile-sdk'
    },
    {
        icon: TemplateIcon,
        title: 'App Builder',
        description: 'Visual app builder with drag-and-drop interface and pre-built components.',
        points: ['No-code/low-code builder', 'Pre-built templates', 'Custom component library', 'Real-time collaboration'],
        link: '/#/app-builder'
    },
    {
        icon: CloudIcon,
        title: 'Cloud Hosting',
        description: 'Reliable, scalable hosting solutions with global CDN and monitoring.',
        points: ['Auto-scaling infrastructure', 'Global edge deployment', 'SSL certificates included', '99.9% uptime guarantee'],
        link: '/#/cloud-hosting'
    },
    {
        icon: BuildingOfficeIcon,
        title: 'Enterprise Solutions',
        description: 'Custom solutions, consulting, and support for large organizations.',
        points: ['Strategic consulting', 'Custom development', 'Team augmentation', 'Dedicated enterprise support'],
        link: '/#/enterprise-solutions'
    }
];

interface FeatureCardProps {
    feature: Feature;
    index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        const currentRef = cardRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <div 
            ref={cardRef}
            className={`bg-gray-900 border border-gray-800 rounded-lg p-6 flex flex-col transition-all duration-500 ease-out hover:border-brand-blue hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <div className="flex items-center space-x-4 mb-4">
                <feature.icon 
                    className={`h-8 w-8 text-brand-blue transition-all duration-500 ease-out transform ${
                        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                    }`} 
                />
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
            </div>
            <p className="text-gray-400 mb-4">{feature.description}</p>
            <ul className="space-y-2 text-gray-400 flex-grow">
                {feature.points.map((point, index) => (
                    <li key={index} className="flex items-start">
                        <span className="text-brand-blue mr-2 mt-1">&#8226;</span>
                        {point}
                    </li>
                ))}
            </ul>
            <a href={feature.link} className="mt-6 text-brand-blue font-semibold hover:text-blue-400 transition-colors">
                Learn More &rarr;
            </a>
        </div>
    );
};

const Features: React.FC = () => {
    return (
        <section id="features" className="py-20 sm:py-24 lg:py-32 bg-black">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
                        Complete Development Ecosystem
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                        From concept to deployment, Aenzbi provides all the tools and services you need to build exceptional software.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;