/**
 * Prompt History Management Utility
 * Stores and retrieves user's recent prompts using localStorage
 */

const PROMPT_HISTORY_KEY = 'ai-creative-suite-prompt-history';
const MAX_HISTORY_SIZE = 50;

export interface PromptHistoryItem {
    text: string;
    timestamp: number;
    tab: string; // Which tab was used
}

/**
 * Get prompt history from localStorage
 */
export const getPromptHistory = (): PromptHistoryItem[] => {
    try {
        const stored = localStorage.getItem(PROMPT_HISTORY_KEY);
        if (!stored) return [];
        return JSON.parse(stored) as PromptHistoryItem[];
    } catch (error) {
        console.error('Error reading prompt history:', error);
        return [];
    }
};

/**
 * Add a new prompt to history
 */
export const addPromptToHistory = (prompt: string, tab: string): void => {
    if (!prompt.trim()) return;

    try {
        const history = getPromptHistory();

        // Don't add duplicates of the most recent prompt
        if (history.length > 0 && history[0].text === prompt.trim()) {
            return;
        }

        const newItem: PromptHistoryItem = {
            text: prompt.trim(),
            timestamp: Date.now(),
            tab
        };

        // Add to beginning and limit to MAX_HISTORY_SIZE
        const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_SIZE);

        localStorage.setItem(PROMPT_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
        console.error('Error saving prompt to history:', error);
    }
};

/**
 * Clear all prompt history
 */
export const clearPromptHistory = (): void => {
    try {
        localStorage.removeItem(PROMPT_HISTORY_KEY);
    } catch (error) {
        console.error('Error clearing prompt history:', error);
    }
};

/**
 * Get prompts filtered by tab
 */
export const getPromptsByTab = (tab: string): PromptHistoryItem[] => {
    const history = getPromptHistory();
    return history.filter(item => item.tab === tab);
};

/**
 * Format timestamp to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}m atrás`;
    return 'agora mesmo';
};
