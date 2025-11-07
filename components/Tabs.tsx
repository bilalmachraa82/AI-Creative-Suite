import React, { useState, useEffect, useRef } from 'react';

interface TabsProps {
    tabs: string[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

// Emoji icons for each tab
const TAB_ICONS: Record<number, string> = {
    0: '📸', // Photoshoot
    1: '🚀', // Batch
    2: '✨', // Edit
    3: '🎨', // Generate Image
    4: '🎬', // Generate Video
    5: '📝'  // Generate Content
};

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab }) => {
    const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const [underlineStyle, setUnderlineStyle] = useState({});
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
        <div className="relative w-full mb-8">
            {/* Glass Container for Tabs */}
            <div className="glass-card px-4 md:px-6 py-2 overflow-x-auto">
                <nav className="flex gap-2 md:gap-3" aria-label="Tabs" role="tablist">
                    {tabs.map((tab, index) => {
                        const isActive = activeTab === tab;
                        const isHovered = hoveredIndex === index;

                        return (
                            <button
                                key={tab}
                                ref={el => tabsRef.current[index] = el}
                                onClick={() => setActiveTab(tab)}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                role="tab"
                                aria-selected={isActive}
                                aria-controls={`tabpanel-${index}`}
                                className={`
                                    group relative
                                    whitespace-nowrap py-3 px-4 md:px-6
                                    font-medium text-xs md:text-sm
                                    rounded-xl
                                    transition-all duration-300
                                    focus:outline-none
                                    ${isActive
                                        ? 'text-white scale-105'
                                        : 'text-slate-400 hover:text-white hover:scale-105'
                                    }
                                `}
                                style={{
                                    transform: isHovered && !isActive ? 'translateY(-2px)' : 'translateY(0)',
                                }}
                            >
                                {/* Active Tab Background */}
                                {isActive && (
                                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                                        <div
                                            className="absolute inset-0 animate-glow"
                                            style={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #fa709a 100%)',
                                                opacity: 0.9
                                            }}
                                        />
                                        <div className="absolute inset-0 animate-pulse"
                                             style={{
                                                 background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1), transparent)',
                                             }}
                                        />
                                    </div>
                                )}

                                {/* Hover Effect */}
                                {!isActive && isHovered && (
                                    <div className="absolute inset-0 rounded-xl"
                                         style={{
                                             background: 'rgba(255, 255, 255, 0.05)',
                                             backdropFilter: 'blur(10px)'
                                         }}
                                    />
                                )}

                                {/* Tab Content */}
                                <span className="relative z-10 flex items-center gap-2">
                                    <span className="text-base md:text-lg transition-transform duration-300"
                                          style={{
                                              transform: isActive ? 'scale(1.2)' : 'scale(1)'
                                          }}>
                                        {TAB_ICONS[index]}
                                    </span>
                                    <span className="hidden sm:inline font-sora">
                                        {tab}
                                    </span>
                                </span>

                                {/* Ripple Effect on Click */}
                                {isActive && (
                                    <span className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                                        <span className="absolute inset-0 animate-pulse"
                                              style={{
                                                  background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                                              }}
                                        />
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Animated Underline Indicator */}
            <div className="relative h-1 mt-2">
                <div
                    className="absolute h-full rounded-full transition-all duration-500"
                    style={{
                        ...underlineStyle,
                        background: 'linear-gradient(90deg, #667eea, #764ba2, #fa709a)',
                        boxShadow: '0 0 20px rgba(102, 126, 234, 0.6)',
                        filter: 'blur(2px)'
                    }}
                />
                <div
                    className="absolute h-full rounded-full transition-all duration-500"
                    style={{
                        ...underlineStyle,
                        background: 'linear-gradient(90deg, #667eea, #764ba2, #fa709a)',
                        boxShadow: '0 0 10px rgba(102, 126, 234, 0.8)'
                    }}
                />
            </div>

            {/* Mobile Tab Names Helper */}
            <div className="sm:hidden mt-3 text-center">
                <span className="text-sm text-slate-400 font-organic">
                    {activeTab}
                </span>
            </div>
        </div>
    );
};