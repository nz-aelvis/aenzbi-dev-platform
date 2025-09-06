
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { SearchIcon, BellIcon, UserCircleIcon } from './icons';
import { GoogleGenAI, Type } from "@google/genai";

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
    id: number;
    message: string;
    type: NotificationType;
    read: boolean;
}

const Header: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState('');
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    const [showResults, setShowResults] = useState(false);
    
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
    const [hasFetchedNotifications, setHasFetchedNotifications] = useState(false);
    const notificationMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
            if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const debounce = (func: (...args: any[]) => void, delay: number) => {
        let timeout: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    const handleSearch = async (query: string) => {
        if (query.trim().length < 3) {
            setSearchResults('');
            setShowResults(false);
            return;
        }

        setIsLoadingSearch(true);
        setShowResults(true);
        setSearchResults('');

        try {
            if (!process.env.API_KEY) {
                throw new Error("API key not configured.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `You are a helpful search assistant for a developer platform called Aenzbi. Aenzbi offers software development, training, hosting, app building, deployment, and security. Answer the user's query concisely based on these services. Query: "${query}"`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setSearchResults(response.text);

        } catch (error) {
            console.error("AI search failed:", error);
            setSearchResults("Sorry, I couldn't find an answer. Please try rephrasing your question.");
        } finally {
            setIsLoadingSearch(false);
        }
    };

    const debouncedSearch = useCallback(debounce(handleSearch, 500), []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim().length > 2) {
            setIsLoadingSearch(true);
            setShowResults(true);
            debouncedSearch(query);
        } else {
            setShowResults(false);
        }
    };
    
    const fetchNotifications = async () => {
        setIsLoadingNotifications(true);
        try {
            if (!process.env.API_KEY) throw new Error("API key not configured.");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Generate a list of 5 realistic, unread notifications for a developer platform dashboard called Aenzbi. Topics can include build status (success/failure), security alerts, new comments on projects, or plan updates. Provide a 'message' and a 'type' ('success', 'error', 'info') for each.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            notifications: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        message: { type: Type.STRING },
                                        type: { type: Type.STRING }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            const data = JSON.parse(response.text);
            const newNotifications = data.notifications.map((n: any, index: number) => ({
                id: Date.now() + index,
                message: n.message,
                type: ['success', 'error', 'info'].includes(n.type) ? n.type : 'info',
                read: false,
            }));
            setNotifications(newNotifications);
            setUnreadCount(newNotifications.length);
            setHasFetchedNotifications(true);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setIsLoadingNotifications(false);
        }
    };

    const handleBellClick = () => {
        setIsNotificationsOpen(prev => !prev);
        if (!hasFetchedNotifications && !isNotificationsOpen) {
            fetchNotifications();
        }
    };
    
    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    return (
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <a href="/#" className="text-2xl font-bold text-white">Aenzbi</a>
                    </div>
                    <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-center">
                        <div className="max-w-md w-full lg:max-w-xs relative">
                            <label htmlFor="search" className="sr-only">Search</label>
                            <div className="relative text-gray-400 focus-within:text-gray-200">
                                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <SearchIcon className="h-5 w-5" />
                                </div>
                                <input
                                    id="search"
                                    className="block w-full bg-gray-900 border border-gray-700 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-200 focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue"
                                    placeholder="Ask the AI Assistant..."
                                    type="search"
                                    name="search"
                                    value={searchQuery}
                                    onChange={handleInputChange}
                                    onFocus={() => searchQuery && setShowResults(true)}
                                    onBlur={() => setTimeout(() => setShowResults(false), 200)}
                                />
                            </div>
                            {showResults && (
                                <div className="absolute mt-2 w-full rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10 p-4 border border-gray-700">
                                    {isLoadingSearch ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-300">{searchResults}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                         <div className="relative" ref={notificationMenuRef}>
                            <button onClick={handleBellClick} className="relative p-1 text-gray-400 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                <span className="sr-only">View notifications</span>
                                <BellIcon className="h-6 w-6" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 text-white text-xs flex items-center justify-center ring-2 ring-gray-900">{unreadCount}</span>
                                )}
                            </button>
                             {isNotificationsOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-700">
                                    <div className="p-3 flex justify-between items-center border-b border-gray-700">
                                        <h3 className="font-semibold text-white">Notifications</h3>
                                        <button onClick={markAllAsRead} className="text-sm text-brand-blue hover:underline disabled:text-gray-500" disabled={unreadCount === 0}>Mark all as read</button>
                                    </div>
                                    <div className="py-1 max-h-80 overflow-y-auto">
                                        {isLoadingNotifications ? (
                                            <div className="flex justify-center items-center p-4">
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            </div>
                                        ) : notifications.length === 0 ? (
                                            <p className="text-center text-gray-400 py-4 text-sm">No new notifications</p>
                                        ) : (
                                            notifications.map(n => (
                                                <div key={n.id} className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-start gap-3">
                                                    {!n.read && <span className="mt-1.5 block h-2 w-2 flex-shrink-0 rounded-full bg-brand-blue"></span>}
                                                    <p className={n.read ? 'pl-5' : ''}>{n.message}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                             )}
                        </div>
                        
                        <div className="relative" ref={userMenuRef}>
                            <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="p-1 text-gray-400 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                <span className="sr-only">Open user menu</span>
                                <UserCircleIcon className="h-7 w-7" />
                            </button>
                            {isUserMenuOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-700">
                                    <a href="/#/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => setIsUserMenuOpen(false)}>Dashboard</a>
                                    <a href="/#/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => setIsUserMenuOpen(false)}>Your Profile</a>
                                    <a href="/#/account" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => setIsUserMenuOpen(false)}>Settings</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => setIsUserMenuOpen(false)}>Sign out</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;