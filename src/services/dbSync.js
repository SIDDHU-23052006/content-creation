const API_URL = "/api";

// Mock userId or get from logged in user.
// Currently user is logged in via 'user' in localStorage.
export const getUserId = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.email || "default_user";
    } catch {
        return "default_user";
    }
}

let isSyncing = false;

// Pull all data into localStorage
export const loadDataFromDatabase = async () => {
    const userId = getUserId();
    if (!userId || userId === "default_user") return;
    
    try {
        const res = await fetch(`${API_URL}/db/load?user_id=${userId}`);
        const json = await res.json();
        
        if (json.success && json.data) {
            isSyncing = true; // prevent infinite loop with hooked setItem
            Object.entries(json.data).forEach(([key, value]) => {
                const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
                localStorage.setItem(key, valueStr);
            });
            isSyncing = false;
        }
    } catch (e) {
        console.error("Failed to load from DB", e);
        isSyncing = false;
    }
}

// Push to database
export const saveToDatabase = async (key, value) => {
    if (isSyncing) return;
    const userId = getUserId();
    if (!userId || userId === "default_user") return;
    
    try {
        // Only sync meaningful application keys, avoiding 'user' to prevent infinite loop or isLoggedIn token
        const syncKeys = [
            "creator_chat_history", 
            "userProfile", 
            "ai_feedback", 
            "template_library", 
            "theme", 
            "advancedMode"
        ];
        
        // checking dynamic keys like ai_usage_2024
        if (!syncKeys.includes(key) && !key.startsWith("ai_usage_")) {
            return;
        }

        await fetch(`${API_URL}/db/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: userId,
                key: key,
                value: value
            })
        });
    } catch (e) {
        console.error("Failed to sync to DB", e);
    }
}

// Monkey patch localStorage to listen to sets
export const initDatabaseSync = () => {
    const originalSetItem = localStorage.setItem;
    
    localStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments);
        
        // Async save so we don't block the UI
        try {
            let parsedValue = value;
            try {
                parsedValue = JSON.parse(value);
            } catch (e) {}
            
            saveToDatabase(key, parsedValue);
        } catch (e) {
            console.error("DB Sync error", e);
        }
    };
    
    // Perform initial pull from the database
    // We delay slightly to ensure React has mounted
    setTimeout(() => {
        loadDataFromDatabase().then(() => {
            // Dispatch storage event to trigger React components listening to storage
            window.dispatchEvent(new Event('storage'));
            // Optionally, we can trigger a custom event
            window.dispatchEvent(new CustomEvent('database-sync-complete'));
        });
    }, 500);
}
