import * as  SecureStore from "expo-secure-store"
import * as Localization from "expo-localization";

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

export function getCurrencyLogo(currency: string): string {
    switch (currency.toUpperCase()) {
        case "USD": return "$";
        case "EUR": return "€";
        case "GBP": return "£";
        case "JPY": return "¥";
        case "CNY": return "¥";
        case "KRW": return "₩";
        case "INR": return "₹";
        case "RUB": return "₽";
        case "NGN": return "₦";
        case "THB": return "฿";
        case "VND": return "₫";
        case "PLN": return "t"
        default: return "¤"; // generic currency symbol
    }
}

export function getDeviceCurrencySymbol(): string {
    const currency = Localization.getLocales()[0].currencyCode ?? "USD";
    console.log(Localization.getLocales());
    return getCurrencyLogo(currency);
}



export function getCurrency(currency: string): string {
    try {
        const formatter = new Intl.NumberFormat(undefined, {
            style: "currency",
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
        // Example: "€100" → take the first/last non-numeric char
        const parts = formatter.formatToParts(100);
        const symbol = parts.find(p => p.type === "currency")?.value;
        return symbol || "¤"; // fallback generic
    } catch {
        return "¤"; // fallback if currency not supported
    }
}

export function getEmoji(emojiNames: string) {
    switch (emojiNames) {
        case "food": return "🍜"
        case "fuel": return "⛽"
        case "family" : return "👨‍👩‍👧‍👦"
        case "education" : return "🎓"
        case "shopping" : return "🛍️"
        case "healthcare" : return "💊"
        case "transfer" : return "💵"
        case "housing" : return "🏠"
        case "travel" : return "✈️"
        case "entertainment" : return "🎫"
        case "withdrawl" : return "💳"
        case "bills/utilities" : return "💡"
        case "transportation" : return "🚌"
        case "socializing" : return "🍻"
        case "miscellaneous" : return "💬"
        case "gaming" : return "🎮"
        default:
            return "📎"
    }
}