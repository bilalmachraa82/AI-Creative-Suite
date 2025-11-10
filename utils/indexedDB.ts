/**
 * IndexedDB Utility for Persistent Storage
 * Stores generated images, projects, and user data locally
 */

const DB_NAME = 'AICreativeSuiteDB';
const DB_VERSION = 1;

// Store names
const STORES = {
    IMAGES: 'generated_images',
    PROJECTS: 'projects',
    FAVORITES: 'favorites',
    SETTINGS: 'settings',
};

export interface StoredImage {
    id: string;
    src: string; // base64 or blob URL
    prompt?: string;
    type: string; // 'photoshoot' | 'edit' | 'generate' | 'video'
    timestamp: number;
    projectId?: string;
    favorite?: boolean;
    metadata?: {
        originalFileName?: string;
        variantId?: string;
        mimeType?: string;
    };
}

export interface Project {
    id: string;
    name: string;
    description?: string;
    createdAt: number;
    updatedAt: number;
    imageIds: string[];
    thumbnail?: string;
}

/**
 * Initialize IndexedDB
 */
export const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            // Images store
            if (!db.objectStoreNames.contains(STORES.IMAGES)) {
                const imageStore = db.createObjectStore(STORES.IMAGES, { keyPath: 'id' });
                imageStore.createIndex('timestamp', 'timestamp', { unique: false });
                imageStore.createIndex('projectId', 'projectId', { unique: false });
                imageStore.createIndex('favorite', 'favorite', { unique: false });
                imageStore.createIndex('type', 'type', { unique: false });
            }

            // Projects store
            if (!db.objectStoreNames.contains(STORES.PROJECTS)) {
                const projectStore = db.createObjectStore(STORES.PROJECTS, { keyPath: 'id' });
                projectStore.createIndex('createdAt', 'createdAt', { unique: false });
            }

            // Favorites store (quick access)
            if (!db.objectStoreNames.contains(STORES.FAVORITES)) {
                db.createObjectStore(STORES.FAVORITES, { keyPath: 'id' });
            }

            // Settings store
            if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
                db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
            }
        };
    });
};

/**
 * Save image to IndexedDB
 */
export const saveImage = async (image: StoredImage): Promise<void> => {
    const db = await initDB();
    const transaction = db.transaction([STORES.IMAGES], 'readwrite');
    const store = transaction.objectStore(STORES.IMAGES);

    await store.put(image);

    // Also add to favorites if marked
    if (image.favorite) {
        const favTransaction = db.transaction([STORES.FAVORITES], 'readwrite');
        const favStore = favTransaction.objectStore(STORES.FAVORITES);
        await favStore.put({ id: image.id, timestamp: image.timestamp });
    }

    db.close();
};

/**
 * Get all images (sorted by timestamp, newest first)
 */
export const getAllImages = async (limit = 100): Promise<StoredImage[]> => {
    const db = await initDB();
    const transaction = db.transaction([STORES.IMAGES], 'readonly');
    const store = transaction.objectStore(STORES.IMAGES);
    const index = store.index('timestamp');

    return new Promise((resolve, reject) => {
        const request = index.openCursor(null, 'prev'); // Reverse order (newest first)
        const results: StoredImage[] = [];

        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result;
            if (cursor && results.length < limit) {
                results.push(cursor.value);
                cursor.continue();
            } else {
                db.close();
                resolve(results);
            }
        };

        request.onerror = () => {
            db.close();
            reject(request.error);
        };
    });
};

/**
 * Get images by project ID
 */
export const getImagesByProject = async (projectId: string): Promise<StoredImage[]> => {
    const db = await initDB();
    const transaction = db.transaction([STORES.IMAGES], 'readonly');
    const store = transaction.objectStore(STORES.IMAGES);
    const index = store.index('projectId');

    return new Promise((resolve, reject) => {
        const request = index.getAll(projectId);

        request.onsuccess = () => {
            db.close();
            resolve(request.result);
        };

        request.onerror = () => {
            db.close();
            reject(request.error);
        };
    });
};

/**
 * Get favorite images
 */
export const getFavoriteImages = async (): Promise<StoredImage[]> => {
    const db = await initDB();
    const transaction = db.transaction([STORES.IMAGES], 'readonly');
    const store = transaction.objectStore(STORES.IMAGES);
    const index = store.index('favorite');

    return new Promise((resolve, reject) => {
        const request = index.getAll(true);

        request.onsuccess = () => {
            db.close();
            resolve(request.result);
        };

        request.onerror = () => {
            db.close();
            reject(request.error);
        };
    });
};

/**
 * Delete image
 */
export const deleteImage = async (id: string): Promise<void> => {
    const db = await initDB();
    const transaction = db.transaction([STORES.IMAGES, STORES.FAVORITES], 'readwrite');

    await transaction.objectStore(STORES.IMAGES).delete(id);
    await transaction.objectStore(STORES.FAVORITES).delete(id);

    db.close();
};

/**
 * Toggle favorite status
 */
export const toggleFavorite = async (id: string): Promise<boolean> => {
    const db = await initDB();
    const transaction = db.transaction([STORES.IMAGES, STORES.FAVORITES], 'readwrite');
    const imageStore = transaction.objectStore(STORES.IMAGES);

    const image = await imageStore.get(id);
    if (image) {
        image.favorite = !image.favorite;
        await imageStore.put(image);

        const favStore = transaction.objectStore(STORES.FAVORITES);
        if (image.favorite) {
            await favStore.put({ id: image.id, timestamp: image.timestamp });
        } else {
            await favStore.delete(id);
        }

        db.close();
        return image.favorite;
    }

    db.close();
    return false;
};

/**
 * Create new project
 */
export const createProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    const newProject: Project = {
        ...project,
        id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        imageIds: project.imageIds || [],
    };

    const db = await initDB();
    const transaction = db.transaction([STORES.PROJECTS], 'readwrite');
    const store = transaction.objectStore(STORES.PROJECTS);

    await store.put(newProject);
    db.close();

    return newProject;
};

/**
 * Get all projects
 */
export const getAllProjects = async (): Promise<Project[]> => {
    const db = await initDB();
    const transaction = db.transaction([STORES.PROJECTS], 'readonly');
    const store = transaction.objectStore(STORES.PROJECTS);
    const index = store.index('createdAt');

    return new Promise((resolve, reject) => {
        const request = index.getAll();

        request.onsuccess = () => {
            db.close();
            resolve(request.result.reverse()); // Newest first
        };

        request.onerror = () => {
            db.close();
            reject(request.error);
        };
    });
};

/**
 * Update project
 */
export const updateProject = async (id: string, updates: Partial<Project>): Promise<void> => {
    const db = await initDB();
    const transaction = db.transaction([STORES.PROJECTS], 'readwrite');
    const store = transaction.objectStore(STORES.PROJECTS);

    const project = await store.get(id);
    if (project) {
        const updated = { ...project, ...updates, updatedAt: Date.now() };
        await store.put(updated);
    }

    db.close();
};

/**
 * Delete project
 */
export const deleteProject = async (id: string): Promise<void> => {
    const db = await initDB();
    const transaction = db.transaction([STORES.PROJECTS], 'readwrite');
    const store = transaction.objectStore(STORES.PROJECTS);

    await store.delete(id);
    db.close();
};

/**
 * Clear old images (keep last N days)
 */
export const clearOldImages = async (daysToKeep = 30): Promise<number> => {
    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    const db = await initDB();
    const transaction = db.transaction([STORES.IMAGES], 'readwrite');
    const store = transaction.objectStore(STORES.IMAGES);
    const index = store.index('timestamp');

    return new Promise((resolve, reject) => {
        const request = index.openCursor(IDBKeyRange.upperBound(cutoffTime));
        let deletedCount = 0;

        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result;
            if (cursor) {
                // Don't delete favorites
                if (!cursor.value.favorite) {
                    cursor.delete();
                    deletedCount++;
                }
                cursor.continue();
            } else {
                db.close();
                resolve(deletedCount);
            }
        };

        request.onerror = () => {
            db.close();
            reject(request.error);
        };
    });
};

/**
 * Get storage usage estimate
 */
export const getStorageUsage = async (): Promise<{ used: number; quota: number; percentage: number }> => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const used = estimate.usage || 0;
        const quota = estimate.quota || 0;
        const percentage = quota > 0 ? (used / quota) * 100 : 0;

        return { used, quota, percentage };
    }

    return { used: 0, quota: 0, percentage: 0 };
};
