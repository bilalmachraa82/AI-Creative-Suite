import React, { useState, useEffect, useRef } from 'react';

interface TabsProps {
    tabs: string[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab }) => {
    const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const [underlineStyle, setUnderlineStyle] = useState({});

    useEffect(() => {
        const activeIndex = tabs.indexOf(activeTab);
        const activeTabElement = tabsRef.current[activeIndex];

        if (activeTabElement) {
            setUnderlineStyle({
                left: activeTabElement.offsetLeft,
                width: activeTabElement.offsetWidth,
            });
        }
    }, [activeTab, tabs]);

    return (
        <div className="relative border-b border-slate-800 w-full overflow-x-auto">
            <nav className="flex space-x-6" aria-label="Tabs">
                {tabs.map((tab, index) => (
                    <button
                        key={tab}
                        ref={el => tabsRef.current[index] = el}
                        onClick={() => setActiveTab(tab)}
                        className={`${
                            activeTab === tab
                                ? 'text-white'
                                : 'text-slate-400 hover:text-white'
                        } whitespace-nowrap py-4 px-3 font-medium text-sm transition-colors duration-200 focus:outline-none relative z-10`}
                        aria-current={activeTab === tab ? 'page' : undefined}
                    >
                        {tab}
                    </button>
                ))}
            </nav>
            <div
                className="absolute bottom-0 h-0.5 bg-indigo-500 rounded-full transition-all duration-300 ease-in-out"
                style={underlineStyle}
            />
        </div>
    );
};