export const idb: Promise<IDBDatabase> = new Promise((resolve, reject) => {
  const request = indexedDB.open("conversations", 1);

  request.onsuccess = () => {
    resolve(request.result);
  };

  request.onupgradeneeded = () => {
    const db = request.result;

    db.createObjectStore("conversations");
  };

  request.onerror = () => {
    reject(new Error("Error opening database"));
  };
});
