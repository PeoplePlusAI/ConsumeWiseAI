import { initializeDB } from "ResuableFunctions/CustomHooks";

export function IndexedDbDeleteFun() {
    setTimeout(() => {
        initializeDB(process.env.REACT_APP_INDEXEDDB_DATABASE_NAME, process.env.REACT_APP_INDEXEDDB_DATABASE_VERSION, process.env.REACT_APP_INDEXEDDB_DATABASE_STORENAME)
            .then((db) => {
                db.close();
                const deleteRequest = indexedDB.deleteDatabase(process.env.REACT_APP_INDEXEDDB_DATABASE_NAME);

                deleteRequest.onsuccess = () => {
                    console.log("Database deleted successfully");
                };
            })
            .catch((error) => {
                console.error("Database initialization failed:", error);
            })

    }, 100)
}