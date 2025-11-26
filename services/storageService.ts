
import { Notebook } from '../types';

const STORAGE_KEY = 'note-genius-data';

export const saveNotebooksToCloud = async (notebooks: Notebook[]): Promise<void> => {
    // Simulate network latency for a realistic "cloud" feel
    await new Promise(resolve => setTimeout(resolve, 800));
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notebooks));
    } catch (e) {
        console.error("Storage failed", e);
        throw new Error("Failed to save to cloud");
    }
};

export const loadNotebooksFromCloud = async (): Promise<Notebook[] | null> => {
    // Simulate network fetch latency
    await new Promise(resolve => setTimeout(resolve, 600));
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
             const parsed = JSON.parse(data);
             // JSON.parse converts dates to strings, we need to revive them
             // Recursive function might be better but for this specific structure:
             return parsed.map((nb: any) => ({
                 ...nb,
                 updatedAt: new Date(nb.updatedAt),
                 pages: nb.pages.map((p: any) => ({
                     ...p,
                     // Elements don't have dates, so they are fine
                 }))
             }));
        }
        return null;
    } catch (e) {
        console.error("Load failed", e);
        return null;
    }
};
