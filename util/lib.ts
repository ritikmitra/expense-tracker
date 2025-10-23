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


export function formatTime(date: string) {
    const time = new Date(date)
    return time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // enables AM/PM
    })
}

export function formatDate(value: string) {
    const date = new Date(value);

    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }); // Saturday
    const day = date.getDate(); // 3
    const month = date.toLocaleDateString('en-US', { month: 'short' }); // Oct

    return `${weekday}, ${day} ${month}`;
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
    switch (emojiNames.toLowerCase()) {
        case "food": return "🍜"
        case "fuel": return "⛽"
        case "family": return "👨‍👩‍👧‍👦"
        case "education": return "🎓"
        case "shopping": return "🛍️"
        case "healthcare": return "💊"
        case "transfer": return "💵"
        case "housing": return "🏠"
        case "travel": return "✈️"
        case "entertainment": return "🎫"
        case "withdrawl": return "💳"
        case "bills/utilities": return "💡"
        case "transportation": return "🚌"
        case "socializing": return "🍻"
        case "miscellaneous": return "💬"
        case "gaming": return "🎮"
        default:
            return "📎"
    }
}


function getAvatarColors(name : string) {
    // Hash the name to generate a color
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert hash to 6-digit hex color (background)
  let bgColor = '';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    const hex = '00' + value.toString(16);
    bgColor += hex.slice(-2); // Use slice instead of substr
  }

  // Convert hex to RGB for contrast calculation
  const r = parseInt(bgColor.slice(0, 2), 16);
  const g = parseInt(bgColor.slice(2, 4), 16);
  const b = parseInt(bgColor.slice(4, 6), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);

  // Choose text color based on luminance
  const textColor = luminance > 186 ? '000000' : 'FFFFFF';

  return {
    background: bgColor.toUpperCase(), // e.g., "A1C3D4"
    text: textColor                    // e.g., "FFFFFF" or "000000"
  };
}


export const fallbacksIntialUrls = (firstName?: string, lastName?: string) => {
    const { background, text } = getAvatarColors(`${firstName}+${lastName}`);

    return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=${background}&color=${text}`
  }

export const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;