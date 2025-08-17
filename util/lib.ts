import * as  SecureStore from "expo-secure-store"

export function currentGreeting() {
    const date = new Date()
    const hour = date.getHours()
    let greeting;

    if (hour >= 5 && hour < 12) {
        greeting = "Good morning!";
    } else if (hour >= 12 && hour < 17) {
        greeting = "Good afternoon!";
    } else if (hour >= 17 && hour < 21) {
        greeting = "Good evening!";
    } else {
        greeting = "Good night!";
    }

    return greeting;
}


export const secureStorage = {
    getItem: async (key: string) => {
        const value = await SecureStore.getItemAsync(key);
        return value ?? null;
    },
    setItem: async (key: string, value: string) => {
        await SecureStore.setItemAsync(key, value);
    },
    removeItem: async (key: string) => {
        await SecureStore.deleteItemAsync(key);
    },
};


export function formateTime(date: string) {
    const time = new Date(date)
    return time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // enables AM/PM
    })
}