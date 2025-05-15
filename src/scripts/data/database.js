import { openDB } from "idb";

const DATABASE_NAME = "ceritaku";
const DATABASE_VERSION = 1;
const STORE_NAME = "save-story";

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "id" });
    }
  },
});

export const saveStory = async (story) => {
  try {
    const db = await dbPromise;
    await db.put(STORE_NAME, story);
    console.log("Story berhasil disimpan");
    return true;
  } catch (error) {
    console.error("Failed to save story:", error);
    return false;
  }
};

export const getSavedStories = async () => {
  try {
    const db = await dbPromise;
    return await db.getAll(STORE_NAME);
  } catch (error) {
    console.error("Failed to get saved stories:", error);
    return [];
  }
};

export const deleteStory = async (id) => {
  try {
    const db = await dbPromise;
    await db.delete(STORE_NAME, id);
    console.log("Story berhasil dihapus");
    return true;
  } catch (error) {
    console.error("Failed to delete story");
    return false;
  }
};

export const checkIfStorySaved = async (id) => {
  try {
    const db = await dbPromise;
    return (await db.get(STORE_NAME, id)) !== undefined;
  } catch (error) {
    console.error("Failed to check story:", error);
    return false;
  }
};
