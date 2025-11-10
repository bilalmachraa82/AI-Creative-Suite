/**
 * Keyboard Shortcuts Manager
 * Provides keyboard navigation and power user features
 */

export interface Shortcut {
    key: string;
    ctrl?: boolean;
    cmd?: boolean;
    shift?: boolean;
    alt?: boolean;
    description: string;
    action: () => void;
    category: 'general' | 'images' | 'navigation' | 'editing';
}

class KeyboardShortcutsManager {
    private shortcuts: Map<string, Shortcut> = new Map();
    private enabled = true;

    constructor() {
        this.initializeEventListener();
    }

    private initializeEventListener() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    private getShortcutKey(event: KeyboardEvent): string {
        const modifiers = [];
        if (event.ctrlKey || event.metaKey) modifiers.push('ctrl');
        if (event.shiftKey) modifiers.push('shift');
        if (event.altKey) modifiers.push('alt');

        const key = event.key.toLowerCase();
        return [...modifiers, key].join('+');
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (!this.enabled) return;

        // Don't trigger shortcuts when typing in input fields
        const target = event.target as HTMLElement;
        if (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable
        ) {
            // Allow Escape key even in input fields
            if (event.key !== 'Escape') return;
        }

        const shortcutKey = this.getShortcutKey(event);
        const shortcut = this.shortcuts.get(shortcutKey);

        if (shortcut) {
            event.preventDefault();
            event.stopPropagation();
            shortcut.action();
        }
    }

    register(shortcut: Shortcut) {
        const modifiers = [];
        if (shortcut.ctrl || shortcut.cmd) modifiers.push('ctrl');
        if (shortcut.shift) modifiers.push('shift');
        if (shortcut.alt) modifiers.push('alt');

        const key = [... modifiers, shortcut.key.toLowerCase()].join('+');
        this.shortcuts.set(key, shortcut);
    }

    unregister(key: string) {
        this.shortcuts.delete(key);
    }

    getAll(): Shortcut[] {
        return Array.from(this.shortcuts.values());
    }

    getAllByCategory(): Record<string, Shortcut[]> {
        const shortcuts = this.getAll();
        const byCategory: Record<string, Shortcut[]> = {
            general: [],
            images: [],
            navigation: [],
            editing: [],
        };

        shortcuts.forEach((shortcut) => {
            byCategory[shortcut.category].push(shortcut);
        });

        return byCategory;
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    clear() {
        this.shortcuts.clear();
    }

    formatShortcut(shortcut: Shortcut): string {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const modifiers = [];

        if (shortcut.ctrl || shortcut.cmd) {
            modifiers.push(isMac ? '⌘' : 'Ctrl');
        }
        if (shortcut.shift) {
            modifiers.push(isMac ? '⇧' : 'Shift');
        }
        if (shortcut.alt) {
            modifiers.push(isMac ? '⌥' : 'Alt');
        }

        const key = shortcut.key.toUpperCase();
        return [...modifiers, key].join(isMac ? '' : '+');
    }
}

// Singleton instance
export const keyboardShortcuts = new KeyboardShortcutsManager();

// Helper to check if Mac
export const isMac = () => navigator.platform.toUpperCase().indexOf('MAC') >= 0;
