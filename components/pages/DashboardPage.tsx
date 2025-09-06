import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { SparklesIcon, BriefcaseIcon, ArrowUpCircleIcon, CheckCircleIcon, ClockIcon, PlusCircleIcon, CommandLineIcon, CloudArrowUpIcon } from '../icons';

// Data Structures
interface StatCard {
    icon: React.ElementType;
    value: string;
    label: string;
    description: string;
}

interface Project {
    id: string;
    name: string;
    tech: string;
    status: 'Active' | 'Building' | 'Error' | 'Idle';
    lastDeployed: string;
}

interface ActivityItem {
    id: string;
    text: string;
    time: string;
}

const techStacks = ["React", "Vue", "Node.js", "Python", "Go", "Rust"];
const statuses: Array<Project['status']> = ['Active', 'Building', 'Error', 'Idle'];

const DashboardPage: React.FC = () => {
    // State
    const [stats, setStats] = useState<StatCard[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [activity, setActivity] = useState<ActivityItem[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [projectSummary, setProjectSummary] = useState('');
    
    // Loading States
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);

    // AI-powered project summary generator
    const handleProjectSelect = async (project: Project) => {
        if (!project || selectedProject?.id === project.id) return;
        setSelectedProject(project);
        setIsLoadingSummary(true);
        setProjectSummary('');
        try {
            if (!process.env.API_KEY) throw new Error("API key not configured.");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Generate a brief, one-paragraph project status summary for a project named "${project.name}" on the Aenzbi developer platform. Include fictional but realistic details about its latest build status (e.g., successful), last deployment time, and a potential monitoring alert (e.g., 'CPU usage is high'). Keep it concise.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            setProjectSummary(response.text);
        } catch (error) {
            console.error("Failed to fetch project summary:", error);
            setProjectSummary("Could not load summary for this project.");
        } finally {
            setIsLoadingSummary(false);
        }
    };

    // AI-powered initial data fetch
    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                if (!process.env.API_KEY) throw new Error("API key not configured.");
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const prompt = `Generate realistic data for a developer dashboard on the Aenzbi platform. Provide:
                1. A list of 6 "projects" with just an id and a name (e.g., 'WebApp-Prod', 'Mobile-API').
                2. A list of 5 recent "activity" items with an id, a short text description, and a relative time (e.g., '5m ago').
                3. A list of 4 "stats" for summary cards with a value (string), label (string), and a short description (string). The labels must be 'Active Projects', 'Deployments (Week)', 'Build Success', and 'Uptime'.`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                projects: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING } }}},
                                activity: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, text: { type: Type.STRING }, time: { type: Type.STRING } }}},
                                stats: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { value: { type: Type.STRING }, label: { type: Type.STRING }, description: { type: Type.STRING } }}}
                            }
                        }
                    }
                });
                
                const data = JSON.parse(response.text);

                const iconMap: { [key: string]: React.ElementType } = {
                    'Active Projects': BriefcaseIcon,
                    'Deployments (Week)': ArrowUpCircleIcon,
                    'Build Success': CheckCircleIcon,
                    'Uptime': ClockIcon,
                };
                setStats(data.stats.map((stat: any) => ({ ...stat, icon: iconMap[stat.label] || BriefcaseIcon })));
                
                const enrichedProjects = data.projects.map((p: any) => ({
                    ...p,
                    tech: techStacks[Math.floor(Math.random() * techStacks.length)],
                    status: 'Active',
                    lastDeployed: `${Math.floor(Math.random() * 24)} hours ago`
                }));
                setProjects(enrichedProjects);
                setActivity(data.activity);
                if(enrichedProjects.length > 0) {
                    handleProjectSelect(enrichedProjects[0]);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                // Fallback data
                 setStats([
                    { icon: BriefcaseIcon, value: '6', label: 'Active Projects', description: 'Projects with recent activity.' },
                    { icon: ArrowUpCircleIcon, value: '12', label: 'Deployments (Week)', description: 'Successful deployments in the last 7 days.' },
                    { icon: CheckCircleIcon, value: '98.5%', label: 'Build Success', description: 'Success rate for all CI/CD builds.' },
                    { icon: ClockIcon, value: '99.98%', label: 'Uptime', description: 'Platform uptime over the last 30 days.' },
                ]);
                // FIX: Explicitly type `fallbackProjects` as `Project[]` to ensure type compatibility for the `status` property.
                const fallbackProjects: Project[] = [
                    {id: 'proj1', name: 'WebApp-Prod', tech: 'React', status: 'Active', lastDeployed: '2 hours ago'}, 
                    {id: 'proj2', name: 'Mobile-API', tech: 'Node.js', status: 'Idle', lastDeployed: '1 day ago'},
                    {id: 'proj3', name: 'Data-Pipeline', tech: 'Python', status: 'Building', lastDeployed: '5 minutes ago'},
                    {id: 'proj4', name: 'Marketing-Site', tech: 'Vue', status: 'Error', lastDeployed: '3 hours ago'},
                ];
                setProjects(fallbackProjects);
                setActivity([
                    {id: 'act1', text: "Deployed 'WebApp-Prod' to production.", time: '10m ago'},
                    {id: 'act2', text: "New comment on 'Mobile-API' by Jane Doe.", time: '1h ago'},
                ]);
                if (fallbackProjects.length > 0) {
                    handleProjectSelect(fallbackProjects[0]);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);
    
    // Simulate live status updates
    useEffect(() => {
        const interval = setInterval(() => {
            setProjects(prevProjects => {
                if (prevProjects.length === 0) return [];
                const randomIndex = Math.floor(Math.random() * prevProjects.length);
                const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                return prevProjects.map((p, i) => i === randomIndex ? { ...p, status: newStatus } : p);
            });
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const StatusIndicator: React.FC<{ status: Project['status'] }> = ({ status }) => {
        const baseClasses = "w-3 h-3 rounded-full";
        const statusConfig = {
            Active: { color: "bg-green-500", label: "Active" },
            Building: { color: "bg-yellow-500 animate-pulse", label: "Building" },
            Error: { color: "bg-red-500", label: "Error" },
            Idle: { color: "bg-gray-500", label: "Idle" },
        };
        const config = statusConfig[status];
        return (
            <div className="flex items-center gap-2">
                <span className={`${baseClasses} ${config.color}`}></span>
                <span className="text-sm font-medium text-gray-300">{config.label}</span>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32 text-center">
                 <div className="flex justify-center items-center">
                    <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p className="text-xl ml-4">Loading Dashboard...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-400">Welcome back, here's a summary of your projects.</p>
                </div>
                 <div className="flex gap-4">
                     <button className="flex items-center gap-2 bg-brand-blue text-white font-semibold rounded-lg px-4 py-2 text-sm transition hover:bg-blue-700">
                        <PlusCircleIcon className="w-5 h-5" />
                        New Project
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-lg p-5 flex items-start gap-4">
                        <div className="bg-gray-800 p-3 rounded-lg">
                            <stat.icon className="w-6 h-6 text-brand-blue" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">{stat.value}</p>
                            <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                            <p className="text-gray-500 text-xs mt-1">{stat.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Projects Grid */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-white mb-4">Your Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projects.map(p => (
                            <div key={p.id} className={`relative group bg-gray-900 border border-gray-800 rounded-lg p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer ${selectedProject?.id === p.id ? 'ring-2 ring-brand-blue' : 'hover:border-brand-blue hover:-translate-y-1'}`} onClick={() => handleProjectSelect(p)}>
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-bold text-white mb-2">{p.name}</h3>
                                        <span className="text-xs bg-gray-700 text-gray-300 font-mono px-2 py-1 rounded">{p.tech}</span>
                                    </div>
                                    <div className="mt-2">
                                        <StatusIndicator status={p.status} />
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500">
                                    Last deployed: {p.lastDeployed}
                                </div>
                                <div className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <button className="flex items-center gap-2 bg-gray-700 text-white font-semibold rounded-lg px-3 py-2 text-xs transition hover:bg-gray-600">
                                        <CommandLineIcon className="w-4 h-4" />
                                        View Logs
                                    </button>
                                    <button className="flex items-center gap-2 bg-brand-blue text-white font-semibold rounded-lg px-3 py-2 text-xs transition hover:bg-blue-700">
                                        <CloudArrowUpIcon className="w-4 h-4" />
                                        Redeploy
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Side Panel: Summary & Activity */}
                <div className="space-y-8">
                    {/* Project Summary */}
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                         <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5 text-brand-blue" />
                            AI-Generated Status for {selectedProject?.name}
                        </h3>
                        {isLoadingSummary ? (
                            <div className="space-y-3 animate-pulse">
                                <div className="h-4 bg-gray-800 rounded w-full"></div>
                                <div className="h-4 bg-gray-800 rounded w-full"></div>
                                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm whitespace-pre-wrap">{projectSummary}</p>
                        )}
                    </div>
                    {/* Recent Activity */}
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                        <ul className="space-y-4">
                            {activity.map(item => (
                                <li key={item.id} className="flex gap-3 text-sm">
                                    <ClockIcon className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0"/>
                                    <div>
                                        <p className="text-gray-300">{item.text}</p>
                                        <p className="text-gray-500">{item.time}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;